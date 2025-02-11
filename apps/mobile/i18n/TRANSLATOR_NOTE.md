## Welcome Translators!

These are the translation files for the Dhaaga project *(minus the website)*.

Dhaaga does plan on using any complicated translation platforms.
[Project Patang](https://suvam.io/dhaaga/translate) *(An easy to use
translation tool without the hassle)* is in the works,
and will be switched to in the future.

## Translation Guidelines

Dhaaga is an SNS client that emphasizes user agency and fun.
So, feel free to maintain a casual tone, or even drop a few
joke in here and there ^^

Here are what each files do:

### core.json

The user needs these text strings to be translated in order
to enjoy the app.

### dialogs.json

These are the various dialog popups *(not to be confused with bottom sheets that
pop up from the bottom)* used throughout the app.

The root level key *("collection", "composer", "hub")* give a hint about
where you may be able to see the dialogue

### glossary.json

These are commonly used SNS terms used throughout the app.

You will notice certain singular/plural definitions used in the following way:

```shell
noun.post_one = "Post" # Singular
noun.post_other = "Posts" # Plural
```

### guides.json

These are the user guides accessible by pressing the top right buttons from
certain screens.

User guides may be updated frequently. However, they are not essential to run
the app.

^ So, some level of desync is acceptable.

You will frequently notice the guide texts to be in the following format:

```shell
qPageIntro = "What does this page do?" # The question
aPageIntro = "The page does abc and xyz" # The answer
```

### settings.json

These are the translation text used for various setting
throughout the app.

You should be able to find 90% of them in the settings page and it's 
children screens.

The following vocabulary is used:

```shell
S_settiungKey # indicates a "section"
L_settingKey # indicates "label" for that setting
D_settingKey # indicates "description" for that setting
```

### sheets.json

These are the translation text used for various bottom sheets *
(not to be confused with dialog popups that are already covered under
[dialogs.json](#dialogs.json).

They are considered essential to use tha app.

## Thank You!

Thank you for reading, and thank you for contributing your time 
to help fix the translations in Dhaaga 🥲 