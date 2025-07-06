PROJECT_ID:=
REGION:=
API:=
SERVICE_ACCOUNT:=

create-service-account:
	gcloud iam service-accounts create $(SERVICE_ACCOUNT) --project=$(PROJECT_ID)
	gcloud projects add-iam-policy-binding $(PROJECT_ID) --member=serviceAccount:$(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com  --role="roles/firebase.admin"

build:
	cd app && yarn install && NODE_ENV='production' REACT_APP_API_URL='https://firebase-authentication-hands-on-422450192262.asia-northeast1.run.app/api' \
		yarn react-scripts build && cd -
	cd server && gcloud builds submit . --tag asia.gcr.io/$(PROJECT_ID)/$(API) --project $(PROJECT_ID) && cd -

deploy:
	firebase deploy
	gcloud run deploy $(API) \
		--project $(PROJECT_ID) \
		--image asia.gcr.io/$(PROJECT_ID)/$(API) \
		--platform managed \
		--region $(REGION) \
		--memory 128Mi \
		--concurrency 1 \
		--max-instances 10 \
		--allow-unauthenticated \
		--service-account $(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com \
		--env-vars-file env.yaml
