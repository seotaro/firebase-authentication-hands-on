PROJECT_ID:=
REGION:=
APP:=

build:
	# build app
	rm -rf server/public
	cd app && yarn install && NODE_ENV='production' yarn react-scripts build && mv build ../server/public && cd -

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
		--allow-unauthenticated 
