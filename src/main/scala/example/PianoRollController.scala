package example

/**
 * Created by Larry on 7/11/15.
 */

import PianoRollSettings._
import example.audio.{AudioManager, NotePlayer, Synth}
import MessageQueue._

import scala.scalajs.js

class PianoRollController(pianoRollWorld: PianoRollWorld,
                          pianoRollRenderer: PianoRollRenderer) extends InputProcessor
                          with PlayerListener{

  var noteOffsetFromStartX = -1.0//difference between click and start of note

  val notePlayer = new NotePlayer(pianoRollWorld)
  notePlayer.registerPlayerListener(this)

  val settings = pianoRollWorld.settings
  val log = new Logger(this.getClass)
  val messageQueue = pianoRollWorld.messageQueue

  override def onMouseDown(x: Double, y: Double): Unit = {
    super.onMouseDown(x, y)

    if(pianoRollRenderer.gridRect.containsPoint(x, y)){
      Logger.verbose(s"Piano grid touched $x, $y", this.getClass)
      val state = settings.state

      writeBackDirtyNote()

      val noteAndTrack: Option[(Note, Int)] = pianoRollRenderer.getNoteAtMouseClick(x, y)

      if(noteAndTrack.isDefined) {
        val (note, track) = noteAndTrack.get
        if(state == StateSelect){
          pianoRollWorld.trackSelected(track)
          pianoRollRenderer.menuRenderer.selectInstrumentExternal(track )
          pianoRollWorld.deleteNote(note)
        }
        else if(state == StatePencil){
          if(pianoRollWorld.isTrackActive(track)){//if we're editing the same, track, treat this as changing duration
            Logger.debug(s"Offset $noteOffsetFromStartX", getClass)
            pianoRollWorld.deleteNote(note)
          }else{//otherwise create a brand new note
            //there should be no dirty note right now
            val (midi, beat) = pianoRollRenderer.getMidiAndBeatAtMouseClick(x ,y)//THIS IS COPY PASTED DOWN BELOY
            val newNote = new Note(midi, beat, 0.1)
          }
        }
        pianoRollWorld.dirtyNote = Some(note)//make the note dirty
        noteOffsetFromStartX = x - pianoRollRenderer.getStartXForNote(note.beatPosition)
      }
      else{
        if(state == StatePencil) {//if adding note, create new note
          val (midi, beat) = pianoRollRenderer.getMidiAndBeatAtMouseClick(x ,y)
          val newNote = new Note(midi, beat, 0.1)
          pianoRollWorld.dirtyNote = Some(newNote)
        }
      }
    }
    else if(pianoRollRenderer.rulerRect.containsPoint(x, y)) {
      Logger.verbose(s"Piano ruler touched $x, $y", this.getClass)
      pianoRollWorld.locatorBeat = pianoRollRenderer.getBeatAtMouseClick(x)
//      log(s"Locator beat: ${pianoRollWorld.locatorBeat}")

      if (notePlayer.isPlaying) {
        notePlayer.setPlayPoint(pianoRollWorld.locatorBeat, AudioManager.audio.currentTime)
      }

    }
    else{
      Logger.verbose(s"Untouchable region touched $x, $y", this.getClass)
    }
    if(pianoRollRenderer.menuRect.containsPoint(x, y)){
      pianoRollRenderer.menuRenderer.onClick(x, y)
    }
  }

  override def onDrag(x: Double, y: Double, mouseDownX: Double, mouseDownY: Double): Unit = {
    if(pianoRollRenderer.gridRect.containsPoint(x, y)){
      if(settings.state == StateSelect){
        val adjustedX = x - noteOffsetFromStartX
        val (midi, beat) = pianoRollRenderer.getMidiAndBeatAtMouseClick(adjustedX, y)

        pianoRollWorld.dirtyNote = pianoRollWorld.dirtyNote.map(note => new Note(midi, beat, note.lengthInBeats))

        if(PianoRollConfig.DRAGGING_ENABLED){
          if(pianoRollWorld.dirtyNote.isEmpty){
            //Drag grid
            Logger.debug("Dragging canvas", getClass)
            val dx = x - mouseDownX
            val dy = y - mouseDownY
            if(math.abs(dx) > math.abs(dy)){
              pianoRollWorld.shiftBeat(right = x > mouseDownX, division = 100)
            }else{
              pianoRollWorld.shiftRoll(up = y < mouseDownY, division = 80)
            }
          }
        }

      }
      else if(settings.state == StatePencil){//drag to change length
        val (midi, beat) = pianoRollRenderer.getMidiAndBeatAtMouseClick(x, y)
        pianoRollWorld.dirtyNote = pianoRollWorld.dirtyNote.map(note => {
          val minDuration = 0.001
          val newDuration = Math.max(beat - note.beatPosition, minDuration)
          new Note(note.midi, note.beatPosition, newDuration)
        })
      }
    }
  }

  override def onKey(keyCode: Int): Unit = {
    Logger.debug(keyCode.toString,this.getClass)
    keyCode match{
      case KeyCode.LEFT | KeyCode.A => pianoRollWorld.shiftBeat(right = false)
      case KeyCode.RIGHT | KeyCode.D => pianoRollWorld.shiftBeat(right = true)
      case KeyCode.UP | KeyCode.W => pianoRollWorld.shiftRoll(up = true)
      case KeyCode.DOWN | KeyCode.S => pianoRollWorld.shiftRoll(up = false)
      case KeyCode.X => if(settings.state == StateSelect){
        //delete note if selected, and reset dirty
        pianoRollWorld.dirtyNote.foreach(pianoRollWorld.deleteNote)
        pianoRollWorld.dirtyNote = None
      }
      case KeyCode.E=> {
        settings.state = StateSelect
        writeBackDirtyNote()
        pianoRollRenderer.menuRenderer.selectToolExternal(MessageQueue.TOOL_SELECT)
      }
      //case KeyCode.E => settings.state = StateEdit
      case KeyCode.P | KeyCode.R=> {
        settings.state = StatePencil
        writeBackDirtyNote()
        pianoRollRenderer.menuRenderer.selectToolExternal(MessageQueue.TOOL_PENCIL)
      }
//      case KeyCode. => pianoRollWorld.notes.empty()
//      case KeyCode.P => synth.play()
      case KeyCode.SPACE => {
        if(notePlayer.isPlaying){
          stopMusic()
          //eek: find better way to do this
          pianoRollRenderer.menuRenderer.playPauseButton.toggle()
        }else{
          playMusic()
          pianoRollRenderer.menuRenderer.playPauseButton.toggle()
        }
      }
      case KeyCode.BACKSPACE => {
        //pianoRollWorld.dirtyNote.foreach(note => pianoRollWorld.deleteNote(note))
        pianoRollWorld.dirtyNote = None
      }
      case KeyCode.one => {
        writeBackDirtyNote()
        pianoRollWorld.trackSelected(0)
        pianoRollRenderer.menuRenderer.selectInstrumentExternal(0)
      }
      case KeyCode.two => {
        writeBackDirtyNote()
        pianoRollWorld.trackSelected(1)
        pianoRollRenderer.menuRenderer.selectInstrumentExternal(1)
      }
      case KeyCode.three => {
        writeBackDirtyNote()
        pianoRollWorld.trackSelected(2)
        pianoRollRenderer.menuRenderer.selectInstrumentExternal(2)
      }
      case KeyCode.four => {
        writeBackDirtyNote()
        pianoRollWorld.trackSelected(3)
        pianoRollRenderer.menuRenderer.selectInstrumentExternal(3)
      }
      case KeyCode.five => {
        writeBackDirtyNote()
        pianoRollWorld.trackSelected(4)
        pianoRollRenderer.menuRenderer.selectInstrumentExternal(4)
      }

      case _ =>
    }
  }

  def writeBackDirtyNote(): Unit = {
    pianoRollWorld.dirtyNote.foreach(note => {
      val min_length_to_write = 0.2
      if(note.lengthInBeats > min_length_to_write){
        pianoRollWorld.addNote(note)
      }
    })

    pianoRollWorld.dirtyNote = None
  }

  def playMusic(): Unit ={
    log("Start music")
    notePlayer.prepare()
    notePlayer.setPlayPoint(pianoRollWorld.locatorBeat, AudioManager.audio.currentTime)
  }

  def stopMusic(): Unit ={
    log("Stop music")
    notePlayer.stop()
  }

  override def onKeyWithShift(keyCode: Int): Unit = {
    keyCode match{
      case KeyCode.LEFT => pianoRollWorld.zoomOut(PianoRollController.Zoom)
      case KeyCode.RIGHT => pianoRollWorld.zoomIn(PianoRollController.Zoom)
      case KeyCode.UP => pianoRollWorld.zoomInRoll(PianoRollController.Zoom)
      case KeyCode.DOWN => pianoRollWorld.zoomOutRoll(PianoRollController.Zoom)
      case KeyCode.P => stopMusic()

      case _ => 
    }
  }

  override def onMouseUp(x: Double, y: Double): Unit = {
    super.onMouseUp(x , y)
    if(settings.state == StatePencil){
      writeBackDirtyNote()
    }
  }

  override def onEnd(): Unit = pianoRollWorld.locatorBeat = 0.0

  override def onBeatChanged(beat: Double): Unit = {
    pianoRollWorld.locatorBeat = beat
    if(pianoRollWorld.locatorBeat > pianoRollWorld.endBeat){
      pianoRollWorld.safeSetBeat(pianoRollWorld.endBeat - PianoRollController.LocatorFollowOffset)
    }
  }

  def processMessages(): Unit ={
    while(!messageQueue.isEmpty){
      val message = messageQueue.read()
      log(s"Message $message received")
      message match{
        case PLAY => playMusic()
        case STOP => stopMusic()
        case TOOL_PENCIL => {
          settings.state = StatePencil
          writeBackDirtyNote()

        }
        case TOOL_SELECT => {
          settings.state = StateSelect
          writeBackDirtyNote()
        }
        case HELP => {
          js.Dynamic.global.showHelpModal()
        }
        case PIANO => {
          writeBackDirtyNote()
          pianoRollWorld.trackSelected(0)
        }
        case VIOLIN => {
          writeBackDirtyNote()

          pianoRollWorld.trackSelected(1)
        }
        case BRASS => {
          writeBackDirtyNote()

          pianoRollWorld.trackSelected(2)
        }
        case FLUTE => {
          writeBackDirtyNote()

          pianoRollWorld.trackSelected(3)
        }
        case BASS => {
          writeBackDirtyNote()
          pianoRollWorld.trackSelected(4)
        }
        case _ =>
      }
    }
  }



}

object PianoRollController{
  val HorizontalStepSize = PianoRollConfig.BeatResolution/4//quarter
  val Zoom = 1.5
  val LocatorFollowOffset = PianoRollConfig.BeatResolution/16.0 //sixteenth
}