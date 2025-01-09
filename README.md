## Requirements

1. nvm
2. node 21

## Steps

1. go in the project folder and type in terminal `npm install`
2. (Optional)install nvm with "brew" => https://formulae.brew.sh/formula/nvm
    - if ok close all terminal (cmd+q) logout form pc, logi again, open terminal e type "nvm". 
    - go to project directory (where is package.json) and type "nvm use". This shouls set node 21. If there is error you need to install node 21 with "nvm install 21"
3. type "npm run ios". This command will take much time if the "ios" folder is missing, and after that this should only run the app on ios/simulator
~~6. auth0 for ios need an integration step => https://auth0.com/docs/quickstart/native/react-native/00-login#additional-ios-step-install-the-module-pod~~
7. if previus points worked, you should run "npm run ios" again :)

## to run on your iPhone
8. to run on your phone:
    - open the file ios/myapp.xcodeproj in xcode
    - in xcode:
        - navigate to myapp.xcodeproj and select Signing & capabilities
        - in the "team" dropdown, select your personal team
        - make sure the "bundle identifier" is filled with a value
        - connect the iphone to the computer and trust it
    - on your iPhone: Navigate to Settings > General > Device Management. Select the developer under the ENTERPRISE APPS section. Press Trust [Developer]
    - type `npx expo run:ios -d "iPhone 15 pro di Massimo" --configuration Release` in the console (replace the device name)
