package example

import scala.util.Random

/**
 * Created by Larry on 7/11/15.
 */

import PianoRollSettings._

class PianoRollController(pianoRollContainer: PianoRollContainer, pianoRollRenderer: PianoRollRenderer) extends InputProcessor{

//  //TODO: refactor out?
//
//  val StateSelect = 0//selecting, moving
//  val StateEdit = 1//adding notes, shrinking/expanding notes
//  val StateAdd = 2
//  var state = StateSelect

  //TODO: Move drag logic into InputProcessor

//  var mouseDown = false
//  var mouseDownX = -1.0
//  var mouseDownY = -1.0
  var noteOffsetFromStartX = -1.0//difference between click and start of note

  var settings = new PianoRollSettings()

  val log = new Logger(this.getClass)

  override def onMouseDown(x: Double, y: Double): Unit = {
    //Logger.verbose(s"onMouseDown $x, $y", this.getClass)
//    mouseDown = true
//    mouseDownX = x
//    mouseDownY = y
    super.onMouseDown(x, y)

    if(pianoRollRenderer.gridRect.containsPoint(x, y)){
      Logger.verbose(s"Piano grid touched $x, $y", this.getClass)
      val state = settings.state

      if(state == StateSelect || state == StateEdit) {
        val note = pianoRollRenderer.getNoteAtMouseClick(x, y)
        if(note.isDefined) {

          noteOffsetFromStartX = x - pianoRollRenderer.getStartXForNote(note.get.beatPosition)
          Logger.debug(s"Offset $noteOffsetFromStartX", getClass)
          pianoRollContainer.deleteNote(note.get)
        }
        //set dirty note to new dirty note
        pianoRollContainer.dirtyNote = note

      }
      else if(state == StateAdd) {
        val (midi, beat) = pianoRollRenderer.getMidiAndBeatAtMouseClick(x ,y)
        val newNote = new Note(midi, beat, 0.1)

        pianoRollContainer.dirtyNote = Some(newNote)
      }
    }
    else if(pianoRollRenderer.rulerRect.containsPoint(x, y)){
      Logger.verbose(s"Piano ruler touched $x, $y", this.getClass)
      pianoRollContainer.locatorBeat = pianoRollRenderer.getBeatAtMouseClick(x)
      log(s"Locator beat: ${pianoRollContainer.locatorBeat}")


    }else{
      Logger.verbose(s"Untouchable region touched $x, $y", this.getClass)
    }
  }

//  override def onMouseMove(x: Double, y: Double): Unit = {
//
//    if(mouseDown){
//     onDrag(x, y, mouseDownX, mouseDownY)
//    }
//
//    //Logger.verbose(s"onMouseMove $x, $y", this.getClass)
//  }

  override def onDrag(x: Double, y: Double, mouseDownX: Double, mouseDownY: Double): Unit = {
    if(pianoRollRenderer.gridRect.containsPoint(x, y)){

      if(settings.state == StateSelect){
        val adjustedX = x - noteOffsetFromStartX
        val (midi, beat) = pianoRollRenderer.getMidiAndBeatAtMouseClick(adjustedX, y)
        pianoRollContainer.dirtyNote = pianoRollContainer.dirtyNote.map(note => new Note(midi, beat, note.lengthInBeats))
      }
      else if(settings.state == StateEdit || settings.state == StateAdd){//drag to change length
        val (midi, beat) = pianoRollRenderer.getMidiAndBeatAtMouseClick(x, y)
        pianoRollContainer.dirtyNote = pianoRollContainer.dirtyNote.map(note => {
          val minDuration = 0.001
          val newDuration = Math.max(beat - note.beatPosition, minDuration)
          new Note(note.midi, note.beatPosition, newDuration)
        })
      }
    }
  }


  override def onKey(keyCode: Int): Unit = {
    //Logger.verbose(s"onKey $keyCode", this.getClass)
    keyCode match{
      case KeyCode.LEFT => pianoRollContainer.shiftBeat(right = false)
      case KeyCode.RIGHT => pianoRollContainer.shiftBeat(right = true)
      case KeyCode.UP => pianoRollContainer.shiftRoll(up = true)
      case KeyCode.DOWN => pianoRollContainer.shiftRoll(up = false)
      case KeyCode.X => if(settings.state == StateSelect){
        //delete note if selected, and reset dirty
        pianoRollContainer.dirtyNote.foreach(pianoRollContainer.deleteNote)
        pianoRollContainer.dirtyNote = None
      }
      case KeyCode.S => settings.state = StateSelect
      case KeyCode.E => settings.state = StateEdit
      case KeyCode.A => settings.state = StateAdd
      case _ =>
    }
  }

  override def onKeyWithShift(keyCode: Int): Unit = {
    keyCode match{
      case KeyCode.LEFT => pianoRollContainer.zoomOut(PianoRollController.Zoom)
      case KeyCode.RIGHT => pianoRollContainer.zoomIn(PianoRollController.Zoom)
      case KeyCode.UP => pianoRollContainer.zoomInRoll(PianoRollController.Zoom)
      case KeyCode.DOWN => pianoRollContainer.zoomOutRoll(PianoRollController.Zoom)

      case _ => 
    }
  }

  override def onMouseUp(x: Double, y: Double): Unit = {
    super.onMouseUp(x , y)
    pianoRollContainer.dirtyNote.foreach(note => pianoRollContainer.addNote(note))
    //mouseDown = false
  }

}

object PianoRollController{
  val HorizontalStepSize = PianoRollConfig.BeatResolution/4//quarter
  val Zoom = 1.5
}