find dist/ -name '*.base' | while read filename; do export jsname=$(echo $filename | sed -e 's|\.base||'); cp $filename $jsname; sed -i -e "s|%layoutServiceHost%|$SITECORE_API_HOST|g" -e "s|309ec3e9-b911-4a0b-aa8d-425045b6dcbd|$SITECORE_API_KEY|g" -e "s|%firebaseMessagingSenderId%|$REACT_APP_FIREBASE_SENDER_ID|g" $jsname; done