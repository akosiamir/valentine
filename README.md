# Valentine's Day Puzzle Game (4 Pics 1 Word) 💖

A romantic, customizable web-based puzzle game for your special someone. Solve 3 levels of "4 Pics 1 Word" to unlock the final message!

## 🎮 How to Play
1.  Open `index.html` in any modern web browser (Chrome, Edge, Safari).
2.  Click **"Begin"** to start the music and game.
3.  Guess the word based on the 4 pictures provided.
4.  Complete all 3 puzzles to see the final surprise!

## 🧩 Levels
-   **Level 1**: Answer `GORGEOUS`
-   **Level 2**: Answer `LONGTERM`
-   **Level 3**: Answer `VALENTINE`

## 🛠️ Customization
You can easily change the photos, answers, or messages by editing the code:

### changing Photos
Replace the images in the `photos for puzzle...` folders, or update the file paths in `script.js`.

### Changing Answers/Messages
Open `script.js` and modify the `levels` array:

```javascript
const levels = [
    {
        answer: "YOURWORD",
        hint: "Your custom hint here",
        interstitial: "Message to show after solving...",
        photos: [...]
    },
    ...
];
```

## 🎵 Music
-   Background music is located in the `bg music` folder.
-   To change it, replace the MP3 file and update the `src` in `index.html`:
    ```html
    <audio id="bg-music" loop>
        <source src="bg music/YOUR_SONG.mp3" type="audio/mp3">
    </audio>
    ```

Made with ❤️.
