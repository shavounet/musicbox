window.addEventListener('load', function(event) {

    var piano = Synth.createInstrument('piano');
    var guitar = Synth.createInstrument('acoustic');
    Synth.setVolume(0.1);
    var rythme = 0.5; // black length
    var defaultOctave = 4;
    var defaultDuration = 2.5;
    var noteRegexp = '[a-gA-G\.]';
    var modifierRegexp = 'S';

    function playmusic(notes, instrument){
        if(notes.length > 0){
            console.log("playing " + transposeNote(notes[0].note)+ " with " + instrument.name);
            console.log(notes[0]);
            setTimeout(function(){playmusic(notes.slice(1), instrument);}, notes[0].next * rythme * 1000);
            if(notes[0].note != '.') {
                instrument.play(notes[0].note, notes[0].octave, notes[0].duration);
            }
        }
    };
    function createnote(note, next, duration, octave){
        return {
            note: note,
            octave: octave === undefined ? defaultOctave:octave,
            duration: duration === undefined ? defaultDuration:duration,
            next: next === undefined ? 1:next
        };
    };
    function createAccord(notes, next, octave){
        var music = [];
        for(var i=0 ; i< notes.length ; i++){
            var nextAcc = 0.1;
            if(i==notes.length-1){
                nextAcc = next;
            }
            music.push(createnote(notes[i].toUpperCase(), nextAcc, octave));
        }
        console.log(music);
        return music;
    };
    function transposeNote(note){
        var frnote = '';
        var ennote = note.toUpperCase();
        var mapping = {
            A: 'la',
            B: 'si',
            C: 'do',
            D: 're',
            E: 'mi',
            F: 'fa',
            G: 'sol'
        }
        if (mapping[ennote[0]] != undefined){
            frnote = mapping[ennote[0]];
        }
        if(ennote.slice(1, ennote.length) == '#'){
            frnote += ' dièse';
        }
        return frnote;
    }

    document.getElementById('play').addEventListener("click",function(e){
        var partition = document.getElementById('partition').value;
        console.log("playing " + partition);
        var partition = document.getElementById('partition').value;
        var music = [];
        var totalTime = 0;
        var currentOctave = defaultOctave;

        //music = music.concat(createAccord('ABC', 1));
        for(var i=0 ; i< partition.length ; i++){
            var next = 1;
            var octave = currentOctave;
            var sharp = false;
            var modifierMode = false;

            if(partition[i].match(modifierRegexp)){
                modifierMode = true;
            }
            if(partition[i].match('[a-z]')){
                next = 0.5;
            }
            if(i< partition.length+1) {
                var nextchars = partition.slice(i+1);
                var nextnote = nextchars.search(noteRegexp+'|'+modifierRegexp)
                if(nextnote >= 0){
                    nextchars = nextchars.slice(0, nextnote);
                }
                if(nextchars.contains('-')){
                    next *= 2;
                }
                if(nextchars.contains('^')){
                    octave += 1;
                }
                if(nextchars.contains(',')){
                    octave -= 1;
                }
                if(nextchars.contains('#')){
                    sharp = true;
                }
            }
            if(modifierMode){
                console.log('changing octave to ' + octave.toString());
                currentOctave = octave;
            }
            if(partition[i].match(noteRegexp)) {
                var note = partition[i].toUpperCase() + (sharp ? '#':'');
                music.push(createnote(note, next, undefined, octave));
                totalTime += next;
            }

            if(partition[i] == '|'){
                console.log('(' + i.toString() + ') Total time : '+totalTime.toString());
                totalTime=0;
            }
        }
        playmusic(music, piano);
/*
        playmusic(music, guitar);
*/
    });

    document.getElementById('save').addEventListener("click",function(e){
        localStorage.setItem('current-partition', document.getElementById('partition').value);
        document.getElementById('load').removeAttribute("disabled");
        document.getElementById('saved').innerHTML = localStorage.getItem('current-partition');
    });

    document.getElementById('load').addEventListener("click",function(e){
        document.getElementById('partition').value = localStorage.getItem('current-partition');
    });

    document.getElementById('clear').addEventListener("click",function(e){
        localStorage.setItem('current-partition', '');
        document.getElementById('load').setAttribute("disabled", true);
        document.getElementById('saved').innerHTML = '(rien ici)';
    });

    if(localStorage.getItem('current-partition') === null || localStorage.getItem('current-partition') === '') {
        document.getElementById('load').setAttribute("disabled", true);
    } else {
        document.getElementById('saved').innerHTML = localStorage.getItem('current-partition');
    }


});
