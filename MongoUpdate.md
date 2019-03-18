To update Mongo to Version 4.0 you must first upgrade to 3.6 then to version 4.0 as follows

1. Install 3.6 Binary
2. Close mongo and mongod
3. Start mongo and mongod in 3.6 bin folder
4. run command db.adminCommand({setFeatureCompatibilityVersion: "3.6"})

1. Install 4.0 Binary
2. Close mongo and mongod
3. Start mongo and mongod in 3.6 bin folder
4. run command db.adminCommand({setFeatureCompatibilityVersion: "4.0"})
