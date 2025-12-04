### NonFree Dependencies

Libraries that either bundle NonFree 
dependencies/permissions, depend on the 
Play/App Store runtime, or are not relevant 
for the Lite edition.

### List

- expo-notifications
- react-native-purchases

### Affected Features

- Push Notifications

### Instructions

We need to make sure that all usage of these libraries use
a dynamic import and check for the presence of the
library first.

Also, we need to make sure each module has a fallback 
UI (or throws an error), instead of silently failing.