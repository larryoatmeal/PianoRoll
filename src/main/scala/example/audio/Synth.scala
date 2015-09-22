package example.audio

/**
 * Created by Larry on 8/8/15.
 */

import AudioManager._
import example.{Logger, Note}
import org.scalajs.dom
import org.scalajs.dom.raw.{GainNode, OscillatorNode}

import scala.collection.immutable.IndexedSeq

case class BooleanWrapper(var isTrue: Boolean)

class Synth {
  val log = new Logger(this)

  val gainNode = audio.createGain()

  val oscillator: OscillatorNode = audio.createOscillator()
  oscillator.connect(gainNode)
  oscillator.`type` = "triangle"
  gainNode.connect(audio.destination)
  val polyphony = 32

  val oscillators: IndexedSeq[(OscillatorNode, GainNode, BooleanWrapper)] = (1 to 5).map(
    i => {
      val gainNode = audio.createGain()
      val oscillator: OscillatorNode = audio.createOscillator()
      oscillator.connect(gainNode)
      oscillator.`type` = "triangle"
      gainNode.connect(audio.destination)
      oscillator.start()
      gainNode.gain.value = 0.0
      (oscillator, gainNode, BooleanWrapper(true))
    }
  )



  //polyphonic 
  def polyphonicPlay(note: Note, start: Double, end: Double) = {
    var i = 0
    var continue = true

    if(start > 0 && end > 0){
      while(i < oscillators.length && continue){
        val (oscillator, gainNode, free) = oscillators(i)

        if(free.isTrue){
          log(s"Voice $i")
          //start

          oscillator.frequency.setValueAtTime(Math.pow(2.0, (note.midi-69)/12.0)*440.0, start)
          gainNode.gain.setTargetAtTime(0.5, start, 0.01)
          //stop
          gainNode.gain.setTargetAtTime(0, end, 0.01)

          //break out of loop
          free.isTrue = false
          dom.setTimeout(()=>{free.isTrue = true}, (end - start) * 1000)
          continue = false
        }
        i = i + 1
      }
    }
  }


  def polyphonicPlay(note: Note, when: Double): Unit = {
//    log(s"Playing $note")
//    log(s"At time $when")
//    log(s"Current time ${AudioManager.audio.currentTime}")
//    log(s"Delta time ${when - AudioManager.audio.currentTime}")

    if(when >= 0){
      oscillator.frequency.setValueAtTime(Math.pow(2.0, (note.midi-69)/12.0)*440.0, when)
      gainNode.gain.setTargetAtTime(0.5, when, 0.1)
    }else{
      log.error(s"Time $when is negative")
    }
  }

  def stop(when: Double): Unit = {
    if(when >= 0){
      gainNode.gain.setTargetAtTime(0, when, 0.1)
    } else{
      log.error(s"Time $when is negative")
    }
    //oscillator = null
  }

  def polyphonicStop(): Unit = {
    oscillators.foreach(osc => osc._2.gain.value = 0)
  }
}
