import subprocess

subprocess.run(["npx", "expo", "prebuild"])

# ------ Path to the file you want to modify -------

gradle_props = './android/gradle.properties'

with open(gradle_props, 'r') as file:
    content = file.read()

# Edit
content = content.replace('reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64',
    'reactNativeArchitectures=arm64-v8a')
content = content.replace('expo.useLegacyPackaging=false',
    'expo.useLegacyPackaging=true')

with open(gradle_props, 'w') as file:
    file.write(content)

# ------------------

# ------ Path to the file you want to modify -------

build_gradle = "./android/app/build.gradle"

with open(build_gradle, 'r') as file:
    content = file.read()

# Edit
content = content.replace("applicationId 'io.suvam.dhaaga'",
    "applicationId 'io.suvam.dhaaga.lite'")

with open(build_gradle, 'w') as file:
    file.write(content)

# ------------------

# ------ Path to the file you want to modify -------

info_block = """    dependenciesInfo {
        // Disables dependency metadata when building APKs.
        includeInApk = false
        // Disables dependency metadata when building Android App Bundles.
        includeInBundle = false
    }\n"""

build_gradle = "./android/app/build.gradle"

with open(build_gradle, 'r') as file:
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
        lines.insert(android_block_line_index + 1, info_block + "\n")

with open(build_gradle, 'w') as file:
    file.writelines(lines)

# ------ Path to the file you want to modify -------

strings_xml = "./android/app/src/main/res/values/strings.xml"

with open(strings_xml, 'r') as file:
    content = file.read()

# Edit
content = content.replace("name=\"app_name\">Dhaaga</string>",
    "name=\"app_name\">Dhaaga (Lite)</string>")

with open(strings_xml, 'w') as file:
    file.write(content)

# ------------------

# ------ Path to the file you want to modify -------

# NOTE: at this step, you would to add core to replace your signing key

# ------------------

# NOTE: iOS not supported yet!

# Comment out, if added permanently to your fork
subprocess.run(["bun", "add", "-D", "@react-native-community/cli"])

# --- Core RN scripts ---
# If the build fails at this point, just run "yarn lite:manual"
subprocess.run(["react-native", "build-android", "--mode=release"])
subprocess.run(["cd", "android"])
subprocess.run(["gradlew", "assembleRelease"])

# Comment out, if added permanently to your fork
subprocess.run(["bun", "remove", "@react-native-community/cli"])