import subprocess
import base64
import os

subprocess.run(["npx", "expo", "prebuild", "--platform=android"])

# ------ Path to the file you want to modify -------

def tweak_gradle_properties():
    TARGET = './android/gradle.properties'

    with open(TARGET, 'r') as file:
        content = file.read()

    # Edit
    content = content.replace('reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64',
        'reactNativeArchitectures=arm64-v8a')
    content = content.replace('expo.useLegacyPackaging=false',
        'expo.useLegacyPackaging=true')

    with open(TARGET, 'w') as file:
        file.write(content)

tweak_gradle_properties()
# ------------------

# ------ Path to the file you want to modify -------

def fix_application_id():
    TARGET = "./android/app/build.gradle"

    with open(TARGET, 'r') as file:
        content = file.read()

    # Edit
    content = content.replace("applicationId 'io.suvam.dhaaga'",
        "applicationId 'io.suvam.dhaaga.lite'")

    with open(TARGET, 'w') as file:
        file.write(content)

fix_application_id()
# ------------------

# ------ Path to the file you want to modify -------

def disable_dependency_info():
    TARGET = "./android/app/build.gradle"
    CONTENT = """    dependenciesInfo {
            // Disables dependency metadata when building APKs.
            includeInApk = false
            // Disables dependency metadata when building Android App Bundles.
            includeInBundle = false
    }\n"""

    with open(TARGET, 'r') as file:
       lines = file.readlines()

    android_block_line_index = -1
    for i, line in enumerate(lines):
        if "android {" in line:
            android_block_line_index = i
            break
    if android_block_line_index != -1:
        # Check if the "dependenciesInfo" block already exists under "android {"
        info_block_exists = False
        for i in range(android_block_line_index, len(lines)):
            if "dependenciesInfo {" in lines[i]:
                info_block_exists = True
                break
        if not info_block_exists:
            lines.insert(android_block_line_index + 1, CONTENT + "\n")

    with open(TARGET, 'w') as file:
        file.writelines(lines)

disable_dependency_info()
# ------ Path to the file you want to modify -------

def change_app_name():
    TARGET = "./android/app/src/main/res/values/strings.xml"

    with open(TARGET, 'r') as file:
        content = file.read()

    # Edit
    content = content.replace("name=\"app_name\">Dhaaga</string>",
        "name=\"app_name\">Dhaaga (Lite)</string>")

    with open(TARGET, 'w') as file:
        file.write(content)

change_app_name()
'''

'''
def add_signing_key():
    BASE64_SOURCE = os.getenv("LITE_EDITION_SIGNING_KEY")
    KEY_STORE_PASSWORD = os.getenv("KEY_STORE_PASSWORD")
    KEY_ALIAS = os.getenv("KEY_ALIAS")
    KEY_PASSWORD = os.getenv("KEY_PASSWORD")

    OUTPUT_FILE = "./android/app/dhaaga-lite.keystore"
    GRADLE_FILE = "./android/app/build.gradle"

    # Debug key is used when the env variable is unavailable
    if not BASE64_SOURCE or not KEY_STORE_PASSWORD or not KEY_ALIAS or not KEY_PASSWORD: return

    FILE_DATA = base64.b64decode(BASE64_SOURCE)

    with open(OUTPUT_FILE, 'wb') as file:
        file.write(FILE_DATA)

    with open(GRADLE_FILE, 'r') as file:
        content = file.read()

    content = content.replace("name=\"app_name\">Dhaaga</string>",
                              "name=\"app_name\">Dhaaga (Lite)</string>")
    content = content.replace("storeFile file('debug.keystore')",
                              "storeFile file('dhaaga-lite.keystore')")
    content = content.replace("storePassword 'android'",
                              "storePassword '" + KEY_STORE_PASSWORD + "'")
    content = content.replace("keyAlias 'androiddebugkey'",
                              "keyAlias '" + KEY_ALIAS + "'")
    content = content.replace("keyPassword 'android'",
                              "keyPassword '" + KEY_PASSWORD + "'")

    with open(GRADLE_FILE, 'w') as file:
        file.writelines(content)

add_signing_key()
# ------------------

# NOTE: iOS not supported yet!

# Comment out, if added permanently to your fork
# subprocess.run(["bun", "add", "-D", "@react-native-community/cli"])

# --- Core RN scripts ---
# If the build fails at this point, just run "yarn lite:manual"
# subprocess.run(["npx", "react-native", "build-android", "--mode=release"])
# subprocess.run(["cd", "android"])
# subprocess.run(["gradlew", "assembleRelease"])

# Comment out, if added permanently to your fork
# subprocess.run(["bun", "remove", "@react-native-community/cli"])