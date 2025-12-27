import React from 'react';
import { Language, PhrasePair, SemanticAnchor } from './types';

export const COLORS = {
  BRAND_BLUE: '#6865F0',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  UNDERLINES: [
    '#FFFF00', // Yellow
    '#FF69B4', // Pink
    '#89CFF0', // Baby Blue
  ]
};

export const LANGUAGES_ORDER = [
  Language.ENGLISH, Language.SPANISH,
  Language.FRENCH, Language.GERMAN
];

/**
 * Authoritative Dataset Source: DATA_EN (V4.1), DATA_ES (V4.2), DATA_FR (V4.3), DATA_DE (V4.4)
 */
const datasetAuthoritative = [
  { index: 1, en: ["Hello.", "Hello.", ["Hello"]], es: ["Hola.", "Hola.", ["Hola"]], fr: ["Bonjour.", "Bonjour.", ["Bonjour"]], de: ["Hallo.", "Hallo.", ["Hallo"]] },
  { index: 2, en: ["Nice to meet you.", "Nice to meet you.", ["meet"]], es: ["Mucho gusto.", "Mucho gusto.", ["gusto"]], fr: ["Ravi de te rencontrer.", "Ravi de te rencontrer.", ["rencontrer"]], de: ["Freut mich, dich kennenzulernen.", "Freut mich, dich kennenzulernen.", ["kennenzulernen"]] },
  { index: 3, en: ["How are you?", "Good, thanks. And you?", ["How", "Good"]], es: ["¿Cómo estás?", "Bien, gracias. ¿Y tú?", ["Cómo", "Bien"]], fr: ["Comment ça va ?", "Bien, merci. Et toi ?", ["Comment", "Bien"]], de: ["Wie geht es dir?", "Gut, danke. Und dir?", ["Wie", "Gut"]] },
  { index: 4, en: ["I’m good.", "Are you ready?", ["good", "ready"]], es: ["Estoy bien.", "¿Estás listo?", ["bien", "listo"]], fr: ["Ça va.", "Tu es prêt ?", ["va", "prêt"]], de: ["Mir geht es gut.", "Bist du bereit?", ["gut", "bereit"]] },
  { index: 5, en: ["What are you doing?", "Learning a language.", ["doing", "Learning"]], es: ["¿Qué estás haciendo?", "Aprendiendo un idioma.", ["haciendo", "Aprendiendo"]], fr: ["Qu’est-ce que tu fais ?", "J’apprends une langue.", ["fais", "apprends"]], de: ["Was machst du?", "Ich lerne eine Sprache.", ["machst", "lerne"]] },
  { index: 6, en: ["Me too.", "I like this.", ["too", "like"]], es: ["Yo también.", "Me gusta esto.", ["también", "gusta"]], fr: ["Moi aussi.", "J’aime ça.", ["aussi", "aime"]], de: ["Ich auch.", "Das gefällt mir.", ["auch", "gefällt"]] },
  { index: 7, en: ["How are you learning?", "With FluentFast.", ["learning", "With"]], es: ["¿Cómo estás aprendiendo?", "Con FluentFast.", ["aprendiendo", "Con"]], fr: ["Comment apprends-tu ?", "Avec FluentFast.", ["apprends-tu", "Avec"]], de: ["Wie lernst du?", "Mit FluentFast.", ["lernst", "Mit"]] },
  { index: 8, en: ["Ok, let’s take turn.", "Let’s learn together.", ["turn", "together"]], es: ["Ok, tomemos turnos.", "Aprendamos juntos.", ["turnos", "juntos"]], fr: ["Ok, on alterne.", "Apprenons ensemble.", ["alterne", "ensemble"]], de: ["Okay, wir wechseln uns ab.", "Lass uns zusammen lernen.", ["wechseln", "zusammen"]] },
  { index: 9, en: ["Can you help me?", "Yes, I can.", ["help", "can"]], es: ["¿Puedes ayudarme?", "Sí, puedo.", ["ayudarme", "puedo"]], fr: ["Peux-tu m’aider ?", "Oui, je peux.", ["aider", "peux"]], de: ["Kannst du mir helfen?", "Ja, das kann ich.", ["helfen", "kann"]] },
  { index: 10, en: ["Thanks.", "No problem.", ["Thanks", "problem"]], es: ["Gracias.", "No hay problema.", ["Gracias", "problema"]], fr: ["Merci.", "Pas de problème.", ["Merci", "problème"]], de: ["Danke.", "Kein Problem.", ["Danke", "Problem"]] },
  { index: 11, en: ["Remember, I don’t know much yet.", "Okay, slowly.", ["know", "slowly"]], es: ["Recuerda, todavía no sé mucho.", "Ok, despacio.", ["sé", "despacio"]], fr: ["Souviens-toi, je ne sais pas encore grand-chose.", "D’accord, doucement.", ["sais", "doucement"]], de: ["Denk daran, ich weiß noch nicht viel.", "Okay, langsam.", ["weiß", "langsam"]] },
  { index: 12, en: ["What is this called?", "I don’t know yet.", ["called", "know"]], es: ["¿Cómo se llama esto?", "Todavía no lo sé.", ["llama", "sé"]], fr: ["Comment ça s’appelle ?", "Je ne sais pas encore.", ["appelle", "sais"]], de: ["Wie heißt das?", "Ich weiß es noch nicht.", ["heißt", "weiß"]] },
  { index: 13, en: ["What does it mean?", "Read it there.", ["mean", "Read"]], es: ["¿Qué significa?", "Léelo ahí.", ["significa", "Léelo"]], fr: ["Qu’est-ce que ça veut dire ?", "Lis-le là-bas.", ["dire", "Lis-le"]], de: ["Was bedeutet das?", "Lies es dort.", ["bedeutet", "Lies"]] },
  { index: 14, en: ["Why learn different languages?", "To meet people.", ["Why", "people"]], es: ["¿Por qué aprender idiomas diferentes?", "Para conocer gente.", ["Por", "conocer"]], fr: ["Pourquoi apprendre différentes langues ?", "Pour rencontrer des gens.", ["Pourquoi", "rencontrer"]], de: ["Warum verschiedene Sprachen lernen?", "Um Menschen kennenzulernen.", ["Warum", "Menschen"]] },
  { index: 15, en: ["Meet new friends?", "Sounds great.", ["friends", "great"]], es: ["¿Conocer nuevos amigos?", "Suena genial.", ["amigos", "genial"]], fr: ["Rencontrer de nouveaux amis ?", "Ça a l’air génial.", ["amis", "génial"]], de: ["Neue Freunde treffen?", "Klingt großartig.", ["Freunde", "großartig"]] },
  { index: 16, en: ["Maybe, I’ll travel more.", "Why do you learn?", ["travel", "learn"]], es: ["Tal vez viajaré más.", "¿Por qué aprendes?", ["viajaré", "aprendes"]], fr: ["Peut-être que je voyagerai plus.", "Pourquoi tu apprends ?", ["voyagerai", "apprends"]], de: ["Vielleicht werde ich mehr reisen.", "Warum lernst du?", ["reisen", "lernst"]] },
  { index: 17, en: ["To travel.", "Where do you go?", ["travel", "Where"]], es: ["Para viajar.", "¿A dónde vas?", ["viajar", "dónde"]], fr: ["Pour voyager.", "Où vas-tu ?", ["voyager", "Où"]], de: ["Um zu reisen.", "Wohin gehst du?", ["reisen", "Wohin"]] },
  { index: 18, en: ["I want to go to many countries.", "We can together.", ["want", "together"]], es: ["Quiero ir a muchos países.", "Podemos ir juntos.", ["Quiero", "juntos"]], fr: ["Je veux aller dans beaucoup de pays.", "Nous pouvons ensemble.", ["veux", "ensemble"]], de: ["Ich möchte in viele Länder gehen.", "Wir können zusammen.", ["möchte", "zusammen"]] },
  { index: 19, en: ["I love it.", "So, what is next?", ["love", "next"]], es: ["Me encanta.", "Entonces, ¿qué sigue?", ["encanta", "sigue"]], fr: ["J’adore ça.", "Alors, quelle est la suite ?", ["adore", "suite"]], de: ["Ich liebe es.", "Also, was kommt als Nächstes?", ["liebe", "Nächstes"]] },
  { index: 20, en: ["This is to help.", "Help with what?", ["help", "what"]], es: ["Esto es para ayudar.", "¿Ayudar con qué?", ["ayudar", "qué"]], fr: ["Ceci est para aider.", "Aider avec quoi ?", ["aider", "quoi"]], de: ["Das ist zur Hilfe.", "Hilfe womit?", ["Hilfe", "womit"]] },
  { index: 21, en: ["We can speak together.", "What do you want to say?", ["speak", "say"]], es: ["Podemos hablar juntos.", "¿Qué quieres decir?", ["hablar", "decir"]], fr: ["Nous pouvons parler ensemble.", "Que veux-tu dire ?", ["parler", "dire"]], de: ["Wir können zusammen sprechen.", "Was möchtest du sagen?", ["sprechen", "sagen"]] },
  { index: 22, en: ["Not sure.", "Want to practice more?", ["sure", "practice"]], es: ["No estoy seguro.", "¿Quieres practicar más?", ["seguro", "practicar"]], fr: ["Je ne sais pas.", "Tu veux pratiquer plus ?", ["sais", "pratiquer"]], de: ["Nicht sicher.", "Möchtest du mehr üben?", ["sicher", "üben"]] },
  { index: 23, en: ["Yes, a lot.", "Can you speak slowly?", ["lot", "slowly"]], es: ["Sí, mucho.", "¿Puedes hablar despacio?", ["mucho", "despacio"]], fr: ["Oui, beaucoup.", "Peux-tu parler lentement ?", ["beaucoup", "lentement"]], de: ["Ja, viel.", "Kannst du langsam sprechen?", ["viel", "langsam"]] },
  { index: 24, en: ["This is important phrase?", "Very important.", ["important", "important"]], es: ["¿Esta es una frase importante?", "Muy importante.", ["importante", "importante"]], fr: ["C’est une phrase importante ?", "Très importante.", ["importante", "importante"]], de: ["Ist das eine wichtige Phrase?", "Sehr wichtig.", ["wichtige", "wichtig"]] },
  { index: 25, en: ["Ok, say it again.", "Say it more slowly, please?", ["again", "slowly"]], es: ["Ok, dilo otra vez.", "¿Puedes decirlo más despacio, por favor?", ["otra", "despacio"]], fr: ["Ok, dis-le encore.", "Dis-le plus lentement, s’il te plaît ?", ["encore", "lentement"]], de: ["Okay, sag es noch einmal.", "Sag es bitte langsamer?", ["einmal", "langsamer"]] },
  { index: 26, en: ["This is useful.", "Now, I can speak.", ["useful", "speak"]], es: ["Esto es útil.", "Ahora puedo hablar.", ["útil", "hablar"]], fr: ["C’est utile.", "Maintenant, je peux parler.", ["utile", "parler"]], de: ["Das ist nützlich.", "Jetzt kann ich sprechen.", ["nützlich", "sprechen"]] },
  { index: 27, en: ["Me too.", "What to say next?", ["too", "say"]], es: ["Yo también.", "¿Qué decir después?", ["también", "decir"]], fr: ["Moi aussi.", "Que dire ensuite ?", ["aussi", "dire"]], de: ["Ich auch.", "Was soll ich als Nächstes sagen?", ["auch", "sagen"]] },
  { index: 28, en: ["That is good.", "How often practice?", ["good", "often"]], es: ["Eso es bueno.", "¿Con qué frecuencia practicas?", ["bueno", "frecuencia"]], fr: ["C’est bien.", "À quelle fréquence tu pratiques ?", ["bien", "fréquence"]], de: ["Das ist gut.", "Wie oft übst du?", ["gut", "oft"]] },
  { index: 29, en: ["Every day.", "With who?", ["day", "who"]], es: ["Todos los días.", "¿Con quién?", ["días", "quién"]], fr: ["Tous les jours.", "Avec qui ?", ["jours", "qui"]], de: ["Jeden Tag.", "Mit wem?", ["Tag", "wem"]] },
  { index: 30, en: ["Everyone.", "Friends and people?", ["Everyone", "friends"]], es: ["Con todos.", "¿Amigos y gente?", ["todos", "Amigos"]], fr: ["Avec tout le monde.", "Des amis et des gens ?", ["monde", "amis"]], de: ["Mit allen.", "Freunde und Leute?", ["allen", "Freunde"]] },
  { index: 31, en: ["What do I need to say?", "Good question.", ["say", "question"]], es: ["¿Qué necesito decir?", "Buena pregunta.", ["decir", "pregunta"]], fr: ["Que dois-je dire ?", "Bonne question.", ["dire", "question"]], de: ["Was muss ich sagen?", "Gute Frage.", ["sagen", "Frage"]] },
  { index: 32, en: ["Hello again.", "Good to see you.", ["again", "see"]], es: ["Hola de nuevo.", "Qué bueno verte.", ["nuevo", "verte"]], fr: ["Bonjour encore.", "Content de te voir.", ["encore", "voir"]], de: ["Hallo nochmal.", "Schön, dich zu sehen.", ["nochmal", "sehen"]] },
  { index: 33, en: ["How much do you like this?", "This is really good.", ["like", "good"]], es: ["¿Cuánto te gusta esto?", "Esto es muy bueno.", ["gusta", "bueno"]], fr: ["À quel point tu aimes ça ?", "C’est vraiment bien.", ["aimes", "bien"]], de: ["Wie sehr gefällt dir das?", "Das ist wirklich gut.", ["gefällt", "gut"]] },
  { index: 34, en: ["Let’s speak later today.", "That is a good idea.", ["speak", "idea"]], es: ["Hablemos más tarde hoy.", "Es una buena idea.", ["Hablemos", "idea"]], fr: ["Parlons plus tard aujourd’hui.", "C’est une bonne idée.", ["Parlons", "idée"]], de: ["Lass uns später heute sprechen.", "Das ist eine gute idea.", ["sprechen", "Idee"]] },
  { index: 35, en: ["First, let’s continue.", "Ok, you first.", ["continue", "first"]], es: ["Primero, sigamos.", "Ok, tú primero.", ["sigamos", "primero"]], fr: ["D’abord, continuons.", "Ok, toi d’abord.", ["continuons", "d’abord"]], de: ["Zuerst machen wir weiter.", "Okay, du zuerst.", ["weiter", "zuerst"]] },
  { index: 36, en: ["Do you remember?", "What?", ["remember", "What"]], es: ["¿Te acuerdas?", "¿De qué?", ["acuerdas", "qué"]], fr: ["Tu te souviens ?", "De quoi ?", ["souviens", "quoi"]], de: ["Erinnerst du dich?", "Woran?", ["Erinnerst", "Woran"]] },
  { index: 37, en: ["How to say hello.", "Yes, say hello again.", ["hello", "hello"]], es: ["Cómo decir hola.", "Sí, di hola otra vez.", ["hola", "hola"]], fr: ["Comment dire bonjour.", "Oui, dis bonjour encore.", ["bonjour", "bonjour"]], de: ["Wie man Hallo sagt.", "Ja, sag nochmal Hallo.", ["Hallo", "Hallo"]] },
  { index: 38, en: ["Practice without the phone.", "Better to learn.", ["phone", "Better"]], es: ["Practica sin el teléfono.", "Mejor para aprender.", ["teléfono", "Mejor"]], fr: ["Pratique sans le teléfono.", "C’est mieux pour apprendre.", ["téléphone", "mieux"]], de: ["Übe ohne das Handy.", "Besser zum Lernen.", ["Handy", "Besser"]] },
  { index: 39, en: ["I agree.", "Yes.", ["agree", "Yes"]], es: ["Estoy de acuerdo.", "Sí.", ["acuerdo", "Sí"]], fr: ["Je suis d’accord.", "Oui.", ["accord", "Oui"]], de: ["Ich stimme zu.", "Ja.", ["zustimme", "Ja"]] },
  { index: 40, en: ["What you remember?", "Good questions?", ["remember", "questions"]], es: ["¿Qué recuerdas?", "¿Buenas preguntas?", ["recuerdas", "preguntas"]], fr: ["Que te souviens-tu ?", "De bonnes questions ?", ["souviens-tu", "questions"]], de: ["Was erinnerst du?", "Gute Fragen?", ["erinnerst", "Fragen"]] },
  { index: 41, en: ["Ok, now what?", "What do you like to do?", ["what", "do"]], es: ["Ok, ¿y ahora qué?", "¿Qué te gusta hacer?", ["qué", "gusta"]], fr: ["Ok, et maintenant ?", "Qu’aimes-tu faire ?", ["maintenant", "faire"]], de: ["Okay, was jetzt?", "Was machst du gern?", ["jetzt", "machst"]] },
  { index: 42, en: ["I like learning languages.", "What else do you like?", ["learning", "like"]], es: ["Me gusta aprender idiomas.", "¿Qué más te gusta?", ["aprender", "gusta"]], fr: ["J’aime apprendre des langues.", "Qu’est-ce que tu aimes d’autre ?", ["apprendre", "aimes"]], de: ["Ich lerne gern Sprachen.", "Was machst du sonst gern?", ["lerne", "machst"]] },
  { index: 43, en: ["A lot of things.", "What is this called again?", ["things", "called"]], es: ["Muchas cosas.", "¿Cómo se llama esto otra vez?", ["cosas", "llama"]], fr: ["Beaucoup de choses.", "Comment ça s’appelle déjà ?", ["choses", "appelle"]], de: ["Viele Dinge.", "Wie heißt das nochmal?", ["Dinge", "heißt"]] },
  { index: 44, en: ["FLUENT FAST", "I will remember that.", ["FAST", "remember"]], es: ["FLUENT FAST", "Lo recordaré.", ["FAST", "recordaré"]], fr: ["FLUENT FAST", "Je m’en souviendrai.", ["FAST", "souviendrai"]], de: ["FLUENT FAST", "Das werde ich mir merken.", ["FAST", "merken"]] },
  { index: 45, en: ["Same, when is the next one?", "I’m not sure.", ["next", "sure"]], es: ["Igual, ¿cuándo es el siguiente?", "No estoy seguro.", ["siguiente", "seguro"]], fr: ["Pareil, quand est le prochain ?", "Je ne sais pas.", ["prochain", "sais"]], de: ["Auch, wann ist das nächste?", "Ich bin mir nicht sicher.", ["nächste", "sicher"]] },
  { index: 46, en: ["Look on the home page.", "Why?", ["page", "Why"]], es: ["Mira la página principal.", "¿Por qué?", ["página", "Por"]], fr: ["Regarde sur la page d’accueil.", "Pourquoi ?", ["page", "Pourquoi"]], de: ["Schau auf die Startseite.", "Warum?", ["Startseite", "Warum"]] },
  { index: 47, en: ["You can find them.", "Let’s do it.", ["find", "do"]], es: ["Puedes encontrarlos.", "Hagámoslo.", ["encontrarlos", "Hagámoslo"]], fr: ["Tu peux les trouver.", "Allons-y.", ["trouver", "Allons-y"]], de: ["Du kannst sie finden.", "Lass es uns tun.", ["finden", "tun"]] },
  { index: 48, en: ["Who else would like this?", "I have a friend.", ["Who", "friend"]], es: ["¿A quién más le gustaría esto?", "Tengo un amigo.", ["quién", "amigo"]], fr: ["Qui d’autre aimerait ça ?", "J’ai un ami.", ["autre", "ami"]], de: ["Wer sonst würde das mögen?", "Ich habe einen Freund.", ["Wer", "Freund"]] },
  { index: 49, en: ["What’s the name?", "I’ll tell you.", ["name", "tell"]], es: ["¿Cuál es el nombre?", "Te lo diré.", ["nombre", "diré"]], fr: ["Quel est son nom ?", "Je te dirai.", ["nom", "dirai"]], de: ["Wie heißt er?", "Ich sage es dir.", ["heißt", "sage"]] },
  { index: 50, en: ["I can speak with more people.", "I can do also.", ["speak", "do"]], es: ["Puedo hablar con más personas.", "Yo también puedo.", ["hablar", "puedo"]], fr: ["Je peux parler avec plus de gens.", "Moi aussi, je peux.", ["parler", "peux"]], de: ["Ich kann mit mehr Leuten sprechen.", "Ich kann das auch.", ["sprechen", "kann"]] },
  { index: 51, en: ["What do you like to eat?", "A lot of things.", ["eat", "things"]], es: ["¿Qué te gusta comer?", "Muchas cosas.", ["comer", "cosas"]], fr: ["Qu’est-ce que tu aimes manger ?", "Beaucoup de choses.", ["manger", "choses"]], de: ["Was isst du gern?", "Viele Dinge.", ["isst", "Dinge"]] },
  { index: 52, en: ["At the moment, I’m enjoying practicing.", "What have you learnt?", ["enjoying", "learnt"]], es: ["En este momento, disfruto practicar.", "¿Qué has aprendido?", ["disfruto", "aprendido"]], fr: ["En ce moment, j’aime practicar.", "Qu’as-tu appris ?", ["aime", "appris"]], de: ["Im Moment übe ich gern.", "Was hast du gelernt?", ["übe", "gelernt"]] },
  { index: 53, en: ["Quite a lot of things.", "What’s your favorite?", ["things", "favorite"]], es: ["Bastantes cosas.", "¿Cuál es tu favorito?", ["cosas", "favorito"]], fr: ["Pas mal de choses.", "Quel est ton préféré ?", ["choses", "préféré"]], de: ["Ziemlich viele Dinge.", "Was ist dein Favorit?", ["Dinge", "Favorit"]] },
  { index: 54, en: ["I like saying, hello.", "What don’t you like?", ["saying", "like"]], es: ["Me gusta decir hola.", "¿Qué no te gusta?", ["decir", "gusta"]], fr: ["J’aime dire bonjour.", "Qu’est-ce que tu n’aimes pas ?", ["dire", "aimes"]], de: ["Ich sage gern Hallo.", "Was magst du nicht?", ["Hallo", "magst"]] },
  { index: 55, en: ["I don’t like learning slow.", "I don’t like learning slow, also.", ["slow", "slow"]], es: ["No me gusta aprender despacio.", "A mí tampoco me gusta aprender despacio.", ["despacio", "despacio"]], fr: ["Je n’aime pas apprendre lentement.", "Je n’aime pas apprendre lentement non plus.", ["lentement", "lentement"]], de: ["Ich mag es nicht, langsam zu lernen.", "Ich mag es auch nicht, langsam zu lernen.", ["langsam", "langsam"]] },
  { index: 56, en: ["What is this called?", "You need to say this?", ["called", "say"]], es: ["¿Cómo se llama esto?", "¿Necesitas decir esto?", ["llama", "decir"]], fr: ["Comment ça s’appelle ?", "Tu dois dire ça ?", ["appelle", "dire"]], de: ["Wie heißt das?", "Du musst das sagen?", ["heißt", "sagen"]] },
  { index: 57, en: ["I can see it.", "Next question.", ["see", "question"]], es: ["Puedo verlo.", "Siguiente pregunta.", ["verlo", "pregunta"]], fr: ["Je peux le voir.", "Question suivante.", ["voir", "question"]], de: ["Ich kann es sehen.", "Nächste Frage.", ["sehen", "Frage"]] },
  { index: 58, en: ["This, what is the meaning?", "The spelling is there.", ["meaning", "spelling"]], es: ["Esto, ¿cuál es el significado?", "La ortografía está ahí.", ["significado", "ortografía"]], fr: ["Ça, quelle est la signification ?", "L’orthographe est là.", ["signification", "orthographe"]], de: ["Das hier, was bedeutet es?", "Die Schreibweise ist dort.", ["bedeutet", "Schreibweise"]] },
  { index: 59, en: ["We need to practice more.", "Together?", ["practice", "Together"]], es: ["Necesitamos practicar más.", "¿Juntos?", ["practicar", "Juntos"]], fr: ["Nous devons pratiquer plus.", "Ensemble ?", ["pratiquer", "Ensemble"]], de: ["Wir müssen mehr üben.", "Zusammen?", ["üben", "Zusammen"]] },
  { index: 60, en: ["Yes, together.", "Every day?", ["together", "day"]], es: ["Sí, juntos.", "¿Todos los días?", ["juntos", "días"]], fr: ["Oui, ensemble.", "Tous les jours ?", ["ensemble", "jours"]], de: ["Ja, zusammen.", "Jeden Tag?", ["zusammen", "Tag"]] },
  { index: 61, en: ["Every day.", "Short sessions?", ["day", "sessions"]], es: ["Todos los días.", "¿Sesiones cortas?", ["días", "Sesiones"]], fr: ["Tous les jours.", "De courtes sessions ?", ["jours", "sessions"]], de: ["Jeden Tag.", "Kurze Sitzungen?", ["Tag", "Sitzungen"]] },
  { index: 62, en: ["Yes, short.", "How long?", ["short", "long"]], es: ["Sí, cortas.", "¿Cuánto tiempo?", ["cortas", "tiempo"]], fr: ["Oui, courtes.", "Combien de temps ?", ["courtes", "temps"]], de: ["Ja, kurz.", "Wie lange?", ["kurz", "lange"]] },
  { index: 63, en: ["Ten minutes.", "Enough?", ["minutes", "Enough"]], es: ["Diez minutos.", "¿Suficiente?", ["minutos", "Suficiente"]], fr: ["Dix minutes.", "Assez ?", ["minutes", "Assez"]], de: ["Zehn Minuten.", "Genug?", ["Minuten", "Genug"]] },
  { index: 64, en: ["Maybe more.", "20 minutes.", ["more", "minutes"]], es: ["Tal vez más.", "20 minutos.", ["más", "minutos"]], fr: ["Peut-être plus.", "Vingt minutes.", ["plus", "minutes"]], de: ["Vielleicht mehr.", "Zwanzig Minuten.", ["mehr", "Minuten"]] },
  { index: 65, en: ["Yes, that’s better.", "Tomorrow, meet in the morning.", ["better", "morning"]], es: ["Sí, eso es mejor.", "Mañana, nos vemos por la mañana.", ["mejor", "mañana"]], fr: ["Oui, c’est mieux.", "Demain, rendez-vous le matin.", ["mieux", "matin"]], de: ["Ja, das ist besser.", "Morgen, Treffen am Morgen.", ["besser", "Morgen"]] },
  { index: 66, en: ["Better to meet in the afternoon.", "Ok, I can do that.", ["Better", "do"]], es: ["Mejor vernos por la tarde.", "Ok, puedo hacerlo.", ["Mejor", "hacerlo"]], fr: ["Mieux de se voir l’après-midi.", "Ok, je peux.", ["Mieux", "peux"]], de: ["Besser am Nachmittag treffen.", "Okay, das kann ich.", ["Besser", "kann"]] },
  { index: 67, en: ["I’ll write it.", "Thanks.", ["write", "Thanks"]], es: ["Lo escribiré.", "Gracias.", ["escribiré", "Gracias"]], fr: ["Je vais l’écrire.", "Merci.", ["écrire", "Merci"]], de: ["Ich schreibe es auf.", "Danke.", ["schreibe", "Danke"]] },
  { index: 68, en: ["You’re welcome.", "More than half finished.", ["welcome", "finished"]], es: ["De nada.", "Más de la mitad terminado.", ["nada", "terminado"]], fr: ["De rien.", "Plus de la moitié est terminée.", ["rien", "terminée"]], de: ["Gern geschehen.", "Mehr als die Hälfte geschafft.", ["geschehen", "geschafft"]] },
  { index: 69, en: ["That’s really good.", "Yes, I know.", ["good", "know"]], es: ["Eso es muy bueno.", "Sí, lo sé.", ["bueno", "sé"]], fr: ["C’est vraiment bien.", "Oui, je sais.", ["bien", "sais"]], de: ["Das ist wirklich gut.", "Ja, ich weiß.", ["gut", "weiß"]] },
  { index: 70, en: ["What else can help?", "Stickers.", ["help", "Stickers"]], es: ["¿Qué más puede ayudar?", "Pegatinas.", ["ayudar", "Pegatinas"]], fr: ["Qu’est-ce qui peut aider d’autre ?", "Des autocollants.", ["aider", "autocollants"]], de: ["Was kann noch helfen?", "Aufkleber.", ["helfen", "Aufkleber"]] },
  { index: 71, en: ["Yes, stickers.", "What do you mean?", ["stickers", "mean"]], es: ["Sí, pegatinas.", "¿Qué quieres decir?", ["pegatinas", "decir"]], fr: ["Oui, des autocollants.", "Que veux-tu dire ?", ["autocollants", "dire"]], de: ["Ja, Aufkleber.", "Was meinst du?", ["Aufkleber", "meinst"]] },
  { index: 72, en: ["Put stickers everywhere.", "Why?", ["everywhere", "Why"]], es: ["Pon pegatinas en todas partes.", "¿Por qué?", ["partes", "Por"]], fr: ["Colle des autocollants partout.", "Pourquoi ?", ["partout", "Pourquoi"]], de: ["Klebe überall Aufkleber hin.", "Warum?", ["überall", "Warum"]] },
  { index: 73, en: ["So when you look, you learn.", "That’s a good idea.", ["look", "idea"]], es: ["Así cuando miras, aprendes.", "Es una buena idea.", ["miras", "idea"]], fr: ["Comme ça, quand tu regardes, tu apprends.", "C’est une bonne idée.", ["regardes", "idée"]], de: ["So lernst du, wenn du hinsiehst.", "Das ist eine gute Idee.", ["hinsiehst", "Idee"]] },
  { index: 74, en: ["I know.", "What first?", ["know", "first"]], es: ["Lo sé.", "¿Qué primero?", ["sé", "primero"]], fr: ["Je sais.", "Quoi en premier ?", ["sais", "premier"]], de: ["Ich weiß.", "Was zuerst?", ["weiß", "zuerst"]] },
  { index: 75, en: ["The kitchen.", "Then, the bathroom.", ["kitchen", "bathroom"]], es: ["La cocina.", "Luego, el baño.", ["cocina", "baño"]], fr: ["La cuisine.", "Ensuite, la salle de bain.", ["cuisine", "bain"]], de: ["Die Küche.", "Dann das Badezimmer.", ["Küche", "Badezimmer"]] },
  { index: 76, en: ["So, everywhere in the house?", "Exactly.", ["house", "Exactly"]], es: ["Entonces, ¿en toda la casa?", "Exactamente.", ["casa", "Exactamente"]], fr: ["Donc, partout dans la maison ?", "Exactement.", ["maison", "Exactement"]], de: ["Also überall im Haus?", "Genau.", ["Haus", "Genau"]] },
  { index: 77, en: ["I love this.", "No, me too.", ["love", "too"]], es: ["Me encanta esto.", "No, a mí también.", ["encanta", "también"]], fr: ["J’adore ça.", "Moi aussi.", ["adore", "aussi"]], de: ["Ich liebe das.", "Ich auch.", ["liebe", "auch"]] },
  { index: 78, en: ["Where to travel?", "Travel?", ["travel", "Travel"]], es: ["¿A dónde viajar?", "¿Viajar?", ["viajar", "Viajar"]], fr: ["Où voyager ?", "Voyager ?", ["voyager", "Voyager"]], de: ["Wohin reisen?", "Reisen?", ["reisen", "Reisen"]] },
  { index: 79, en: ["Well, learning a new language.", "Yes, what do you mean?", ["language", "mean"]], es: ["Bueno, aprender un nuevo idioma.", "Sí, ¿qué quieres decir?", ["idioma", "decir"]], fr: ["Eh bien, apprendre une nouvelle langue.", "Oui, que veux-tu dire ?", ["langue", "dire"]], de: ["Nun ja, eine neue Sprache lernen.", "Ja, was meinst du?", ["Sprache", "meinst"]] },
  { index: 80, en: ["Now, we can travel and speak.", "Useful?", ["speak", "Useful"]], es: ["Ahora, podemos viajar y hablar.", "¿Útil?", ["hablar", "Útil"]], fr: ["Maintenant, on puede viajar y hablar.", "Utile ?", ["parler", "Utile"]], de: ["Jetzt können wir reisen und sprechen.", "Nützlich?", ["sprechen", "Nützlich"]] },
  { index: 81, en: ["Very useful.", "Now, repeat it again.", ["useful", "repeat"]], es: ["Muy útil.", "Ahora, repítelo otra vez.", ["útil", "repítelo"]], fr: ["Très utile.", "Maintenant, répète-le encore.", ["utile", "répète-le"]], de: ["Jetzt wiederhole es nochmal.", "Nützlich?", ["nützlich", "wiederhole"]] },
  { index: 82, en: ["And again.", "Again a lot of times.", ["again", "times"]], es: ["Y otra vez.", "Otra vez muchas veces.", ["otra", "veces"]], fr: ["Et encore.", "Encore beaucoup de fois.", ["encore", "fois"]], de: ["Und nochmal.", "Nochmal viele Male.", ["nochmal", "Male"]] },
  { index: 83, en: ["We can try testing each other?", "Is this good?", ["testing", "good"]], es: ["¿Podemos intentar evaluarnos?", "¿Esto es bueno?", ["evaluarnos", "bueno"]], fr: ["On peut essayer de se tester ?", "C’est bien ?", ["tester", "bien"]], de: ["Wir können versuchen, uns gegenseitig zu testen?", "Ist das gut?", ["testen", "gut"]] },
  { index: 84, en: ["Much better.", "Why?", ["better", "Why"]], es: ["Mucho mejor.", "¿Por qué?", ["mejor", "Por"]], fr: ["Beaucoup mieux.", "Pourquoi ?", ["mieux", "Pourquoi"]], de: ["Viel besser.", "Warum?", ["besser", "Warum"]] },
  { index: 85, en: ["To help speaking and listening.", "This is very important.", ["help", "important"]], es: ["Para ayudar a hablar y escuchar.", "Esto es muy importante.", ["ayudar", "importante"]], fr: ["Para ayudar a hablar y escuchar.", "C’est très important.", ["aider", "importante"]], de: ["Um beim Sprechen und Zuhören zu helfen.", "Das ist sehr wichtig.", ["helfen", "wichtig"]] },
  { index: 86, en: ["Ok, almost finished now.", "How much?", ["finished", "much"]], es: ["Ok, casi terminado ahora.", "¿Cuánto?", ["terminado", "Cuánto"]], fr: ["Ok, presque fini maintenant.", "Combien ?", ["fini", "Combien"]], de: ["Okay, jetzt fast fertig.", "Wie viel?", ["fertig", "viel"]] },
  { index: 87, en: ["20 more.", "Are you sure?", ["more", "sure"]], es: ["20 más.", "¿Estás seguro?", ["más", "seguro"]], fr: ["Encore vingt.", "Tu es sûr ?", ["vingt", "sûr"]], de: ["Noch zwanzig.", "Bist du sicher?", ["zwanzig", "sicher"]] },
  { index: 88, en: ["Yes, really close.", "What to do after?", ["close", "do"]], es: ["Sí, muy cerca.", "¿Qué hacer después?", ["cerca", "hacer"]], fr: ["Oui, vraiment proche.", "Que faire après ?", ["proche", "faire"]], de: ["Ja, wirklich nah.", "Was machen wir danach?", ["nah", "machen"]] },
  { index: 89, en: ["First, stop for a moment.", "Then what?", ["stop", "what"]], es: ["Primero, para un momento.", "¿Luego qué?", ["momento", "qué"]], fr: ["D’abord, fais une pause.", "Et ensuite ?", ["pause", "ensuite"]], de: ["Zuerst eine kurze Pause.", "Und dann?", ["Pause", "dann"]] },
  { index: 90, en: ["Practice again.", "Ok, my turn.", ["Practice", "turn"]], es: ["Practicar otra vez.", "Ok, mi turno.", ["Practicar", "turno"]], fr: ["Pratiquer encore.", "Ok, à mon tour.", ["Pratiquer", "tour"]], de: ["Nochmal üben.", "Okay, ich bin dran.", ["üben", "dran"]] },
  { index: 91, en: ["What?", "Tell me something about you?", ["What", "Tell"]], es: ["¿Qué?", "¿Cuéntame algo sobre ti?", ["Qué", "Cuéntame"]], fr: ["Quoi ?", "Parle-moi un peu de toi.", ["Quoi", "Parle-moi"]], de: ["Was?", "Erzähl mir etwas über dich.", ["Was", "Erzähl"]] },
  { index: 92, en: ["What do you want to know?", "What do you like to do?", ["know", "do"]], es: ["¿Qué quieres saber?", "¿Qué te gusta hacer?", ["saber", "gusta"]], fr: ["Que veux-tu savoir ?", "Qu’aimes-tu faire ?", ["savoir", "faire"]], de: ["Was möchtest du wissen?", "Was machst du gern?", ["wissen", "machst"]] },
  { index: 93, en: ["I’m not sure how to answer.", "Ok, that is normal.", ["answer", "normal"]], es: ["No estoy seguro de cómo responder.", "Ok, eso es normal.", ["responder", "normal"]], fr: ["Je ne sais pas comment répondre.", "Ok, c’est normal.", ["répondre", "normal"]], de: ["Ich weiß nicht, wie ich antworten soll.", "Okay, das ist normal.", ["antworten", "normal"]] },
  { index: 94, en: ["But soon, will speak more.", "Tomorrow.", ["speak", "Tomorrow"]], es: ["Pero pronto hablaré más.", "Mañana.", ["hablaré", "Mañana"]], fr: ["Mais bientôt, je parlerai plus.", "Demain.", ["parlerai", "Demain"]], de: ["Aber bald werde ich mehr sprechen.", "Morgen.", ["sprechen", "Morgen"]] },
  { index: 95, en: ["Yes, in the afternoon.", "What about later today?", ["afternoon", "later"]], es: ["Sí, por la tarde.", "¿Qué tal más tarde hoy?", ["tarde", "tarde"]], fr: ["Oui, l’après-midi.", "Et plus tard aujourd’hui ?", ["après-midi", "tard"]], de: ["Ja, am Nachmittag.", "Was ist mit später heute?", ["Nachmittag", "heute"]] },
  { index: 96, en: ["I enjoyed speaking with you.", "You too.", ["enjoyed", "too"]], es: ["Disfruté hablar contigo.", "Tú también.", ["Disfruté", "también"]], fr: ["J’ai aimé parler avec toi.", "Moi aussi.", ["aimé", "aussi"]], de: ["Ich habe es genossen, mit dir zu sprechen.", "Ich auch.", ["genossen", "auch"]] },
  { index: 97, en: ["I hope you have a good day.", "Thanks, you also.", ["hope", "also"]], es: ["Espero que tengas un buen día.", "Gracias, tú también.", ["buen", "también"]], fr: ["J’espère que tu passes une bonne journée.", "Merci, toi aussi.", ["journée", "aussi"]], de: ["Ich hoffe, du hast einen guten Tag.", "Danke, ebenfalls.", ["hoffe", "ebenfalls"]] },
  { index: 98, en: ["Make sure you call me.", "Yes, I remember.", ["call", "remember"]], es: ["Asegúrate de llamarme.", "Sí, lo recuerdo.", ["llamarme", "recuerdo"]], fr: ["Assure-toi de m’appeler.", "Oui, je m’en souviens.", ["appeler", "souviens"]], de: ["Stell sicher, dass du mich anrufst.", "Ja, ich erinnere mich.", ["anrufst", "erinnere"]] },
  { index: 99, en: ["We now finished.", "We did it.", ["finished", "did"]], es: ["Ahora terminamos.", "Lo hicimos.", ["terminamos", "hicimos"]], fr: ["Nous avons maintenant terminé.", "On l’a fait.", ["terminé", "fait"]], de: ["Wir sind jetzt fertig.", "Wir haben es geschafft.", ["fertig", "geschafft"]] },
  { index: 100, en: ["I’m so happy.", "I’m happy also.", ["happy", "happy"]], es: ["Estoy muy feliz.", "Yo también estoy feliz.", ["feliz", "feliz"]], fr: ["Je suis très heureux.", "Je suis heureux aussi.", ["heureux", "heureux"]], de: ["Ich bin so glücklich.", "Ich bin auch glücklich.", ["glücklich", "glücklich"]] },
];

const STRONG_VERBS = ['go', 'eat', 'want', 'need', 'learn', 'help', 'speak', 'travel', 'doing', 'meet', 'know', 'remember', 'say', 'practice', 'write', 'call', 'finished', 'happy'];
const NEGATIONS = ['don’t', 'not', 'no', 'ne…pas', 'nicht', 'tampoco'];

/**
 * resolveFallback (V4.7 UPDATED by V_11.2)
 * Deterministic selection of fallback anchor.
 */
function resolveFallback(text: string, language: Language): string {
  if (!text) return "";
  const words = text.split(/\s+/).map(w => w.replace(/[¡!¿?,.]/g, ''));
  
  // 1. Strong Verb
  const verb = words.find(w => STRONG_VERBS.some(v => w.toLowerCase().includes(v.toLowerCase())));
  if (verb) return verb;

  // 2. Negation
  const neg = words.find(w => NEGATIONS.includes(w.toLowerCase()));
  if (neg) return neg;

  // 3. Concrete Noun (Length-based heuristic)
  const sorted = [...words].sort((a, b) => b.length - a.length);
  return sorted[0] || "";
}

/**
 * Mirror Rule §6 Implementation (UPDATED by V_11.2: Player-Scoped Resolution)
 * Ensures all datasets are perfectly mirrored in structure.
 */
export const PHRASES: PhrasePair[] = datasetAuthoritative.map((step) => {
  const en = (step.en || []) as [string, string, string[]];
  const es = (step.es || []) as [string, string, string[]];
  const fr = (step.fr || []) as [string, string, string[]];
  const de = (step.de || []) as [string, string, string[]];

  const getMap = (partIdx: 0 | 1) => ({
    [Language.ENGLISH]: en[partIdx] || "",
    [Language.SPANISH]: es[partIdx] || "",
    [Language.FRENCH]: fr[partIdx] || "",
    [Language.GERMAN]: de[partIdx] || "",
  });

  /**
   * V_11.2 Anchor Resolution MUST be Player-Local
   */
  const getAnchorsForRole = (roleIdx: 0 | 1): SemanticAnchor[] => {
    const roleTextEn = en[roleIdx] || "";
    const authorAnchorsEn = en[2] || [];
    const clean = (s: string) => s.replace(/[¡!¿?,.]/g, '').toLowerCase();

    // Filter author anchors to only those found in this player role's visible text
    const filteredEn = authorAnchorsEn.filter(a => clean(roleTextEn).includes(clean(a)));

    // Fallback resolution MUST execute separately per player (V11.2 §3.2)
    if (filteredEn.length === 0) {
      return [{
        [Language.ENGLISH]: resolveFallback(en[roleIdx], Language.ENGLISH),
        [Language.SPANISH]: resolveFallback(es[roleIdx], Language.SPANISH),
        [Language.FRENCH]: resolveFallback(fr[roleIdx], Language.FRENCH),
        [Language.GERMAN]: resolveFallback(de[roleIdx], Language.GERMAN),
      }];
    }

    // Map filtered anchors back to the dataset translations (V11.2 §2.1)
    return filteredEn.map(anchorEn => {
      const globalIdx = authorAnchorsEn.indexOf(anchorEn);
      return {
        [Language.ENGLISH]: anchorEn,
        [Language.SPANISH]: es[2]?.[globalIdx] || resolveFallback(es[roleIdx], Language.SPANISH),
        [Language.FRENCH]: fr[2]?.[globalIdx] || resolveFallback(fr[roleIdx], Language.FRENCH),
        [Language.GERMAN]: de[2]?.[globalIdx] || resolveFallback(de[roleIdx], Language.GERMAN),
      };
    });
  };

  return {
    id: step.index,
    player_blue: getMap(0),
    player_white: getMap(1),
    anchors_blue: getAnchorsForRole(0),
    anchors_white: getAnchorsForRole(1)
  };
});

export const Icons = {
  Back: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
    </svg>
  ),
  Next: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
    </svg>
  ),
  Exit: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  ),
  Test: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14.7.02 1.44.39 2.09.78 1.29 2.44 1.91 3.84 1.43 1.12-.31 2-1.31 2.27-2.43.08-.41.09-.82.09-1.23.01-4.7.01-9.4.01-14.1z" />
    </svg>
  )
};