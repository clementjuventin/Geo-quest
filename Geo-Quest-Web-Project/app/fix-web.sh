    #!/bin/bash

    # This script is used to fix PropTypes issues, for running expo start:web (for web) 

    echo 'Fixing ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js, for running expo start:web (for web)'
    echo "for reference: https://github.com/necolas/react-native-web/issues/1537"

    tail -n +9 ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js > ./useResponsiveQuery.web.js
    mv ./useResponsiveQuery.web.js ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js
    
    echo -e "const atomic = () => {};\n$(cat ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js)" > ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js
    echo -e "const createCompileableStyle = () => {};\n$(cat ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js)" > ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js
    echo -e "const i18nStyle = () => {};\n$(cat ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js)" > ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js
    echo -e "const styleResolver = { sheet: { insert: () => {} } };\n$(cat ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js)" > ./node_modules/native-base/lib/module/utils/useResponsiveQuery/useResponsiveQuery.web.js