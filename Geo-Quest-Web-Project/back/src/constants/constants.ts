export enum Endpoints {
    // User
    signIn = '/api/signin',
    signUp = '/api/signup',

    // QUEST
    addQuest = '/api/addquest',
    getQuests = '/api/getquests',
    editQuest = '/api/editquest',
    deleteQuest = '/api/deletequest',

    // LOCATION
    addLocation = '/api/addlocation',
    getLocations = '/api/getlocations',
    claimLocation = '/api/claimlocation',
    removeLocation = '/api/removelocation',
    editLocation = '/api/editlocation',

    // HISTORY
    getLocationHistory = '/api/getlocationhistory',

    // SCOREBOARD
    getScore = '/api/getscore',
    getRank = '/api/getrank',
    getRanking = '/api/getranking',
}
