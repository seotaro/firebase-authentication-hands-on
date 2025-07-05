PROJECT_ID:=
REGION:=
APP:=
SERVICE_ACCOUNT:=

create-service-account:
	gcloud iam service-accounts create $(SERVICE_ACCOUNT) --project=$(PROJECT_ID)
	gcloud projects add-iam-policy-binding $(PROJECT_ID) --member=serviceAccount:$(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com  --role="roles/firebase.admin"


build:
	# build app
	rm -rf server/public
	cd app && yarn install && NODE_ENV='production' REACT_APP_API_URL='https://firebase-authentication-hands-on-422450192262.asia-northeast1.run.app/api' \
		yarn react-scripts build && mv build ../server/public && cd -

	# build docker image
	cd server && gcloud builds submit . --tag asia.gcr.io/$(PROJECT_ID)/$(APP) --project $(PROJECT_ID) && cd -

deploy:
	# deploy to Cloud Run
	gcloud run deploy $(APP) \
		--project $(PROJECT_ID) \
		--image asia.gcr.io/$(PROJECT_ID)/$(APP) \
		--platform managed \
		--region $(REGION) \
		--memory 128Mi \
		--concurrency 1 \
		--max-instances 10 \
		--allow-unauthenticated \
		--service-account $(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com \
		--env-vars-file env.yaml
