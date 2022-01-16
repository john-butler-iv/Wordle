I was playing the Wordle app made by Power Language, and I wanted to play more than one word per day, so I made a clone!
The word list I used is based on the one found at http://www.mieliestronk.com/wordlist.html, and I've only added/removed a handful of words.
This app uses the P5.js framework.

To play, open the html file into your browser.

In case you haven't played,
Before the game starts, a random 5-letter word is chosen that you have to guess.
you can guess a word by typing it and hitting enter (only valid 5-letter words will be accepted). If the word isn't accepting, it's probably not in my list.
Letters not used in hidden word will be gray, letters in the right spot will be green, and if they're in the wrong spot, they'll be orange.
You will be shown the word if you don't correctly guess in 6 tries.
After the games's over, you can start a new one by pressing enter.

Letters can appear more than once in a word, so just because you see that a letter is green, it doesn't mean that it won't be somewhere else.
Let's say, that the hidden word is 'TRAPS' and you guess 'GUESS'. In the original Wordle, the first S in 'GUESS' will be grey since you've already correctly identified all of the S's. My version, however, will show it as an orange letter.