
var midiIsReady = false;
function playNote(channel, midi, delayStart, delayOff){
    console.log("play note", midi, delayStart, delayOff)
    MIDI.setVolume(channel, 127);
    MIDI.noteOn(channel, midi, 127, delayStart);
    MIDI.noteOff(channel, midi, delayOff);
}
function stopAll(){
    MIDI.stopAllNotes()
}
var defaultInstruments = ["acoustic_grand_piano","string_ensemble_1","brass_section", "flute", "acoustic_bass"];

window.onload = function(){
    //console.log("MIDI.js routine");
    //MIDI.Loader = new widgets.Loader({
    //    message: "Loading instruments..."
    //});
    //MIDI.loadPlugin({
    //        soundfontUrl: "./scripts/soundfont/",
    //        instruments: defaultInstruments,
    //        onprogress: function(state, progress){
    //            console.log("Loading midi.js");
    //            console.log(state, progress)
    //        },
    //        onsuccess: function(){
    //            var delay = 0; // play one note every quarter second
    //            var note = 50; // the MIDI note
    //            var velocity = 127; // how hard the note hits
    //            // play the note
    //
    //            midiIsReady = true;
    //            console.log(MIDI.GM.byName);
    //            for(var i = 0; i < defaultInstruments.length; i++){
    //                MIDI.programChange(i, MIDI.GM.byName[defaultInstruments[i]].number); // Load instruments into channels
    //            }
    //
    //            MIDI.setVolume(0, 127);
    //            MIDI.noteOn(0, note, velocity, delay);
    //            MIDI.noteOff(0, note, delay + 0.75);
    //            console.log("Succesfully loaded MIDI.js");
    //
    //            MIDI.Loader.stop()
    //        },
    //        onerror: function(){
    //            console.log("error loading MIDI.js")
    //        }
    //    }
    //);
};