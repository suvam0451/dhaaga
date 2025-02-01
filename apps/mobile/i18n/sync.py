'''
This script makes sure that the translation source files
are fully synced with the english files, and orders the keys
alphabetically for convenience
'''

import json
import os

def sort_json_keys(json_data):
    # If the input is a string, convert it to a Python dictionary
    if isinstance(json_data, str):
        json_data = json.loads(json_data)

    # Sort the dictionary keys
    sorted_json = json.dumps(json_data, indent=4, sort_keys=True)

    return sorted_json

# # Example JSON data
# json_data = {
#     "name": "John",
#     "age": 30,
#     "city": "New York",
#     "hobbies": ["reading", "swimming", "gaming"]
# }
#
# # Print sorted JSON
# sorted_json = sort_json_keys(json_data)
# print(sorted_json)

langs = os.listdir("./i18n/locales")

if "en" not in langs:
    print("No support")

for lang in langs:
    if lang == "en": continue
    files = [f for f in os.listdir("./i18n/locales/" + lang)
        if os.path.isfile(os.path.join("./i18n/locales/" + lang, f))]
    print(lang, files)

