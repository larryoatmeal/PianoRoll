package example.audio

/**
 * Created by Larry on 8/8/15.
 */

import AudioManager._
import example.{Logger, Note}
import org.scalajs.dom.raw.OscillatorNode

class Synth {
  val log = new Logger(this)

  val gainNode = audio.createGain()

  val oscillator: OscillatorNode = audio.createOscillator()
  oscillator.connect(gainNode)
  oscillator.`type` = "sine"
  gainNode.connect(audio.destination)

  //start silent
  oscillator.start()
  gainNode.gain.value = 0.5

  def play(note: Note, when: Double): Unit = {
//    log(s"Playing $note")
//    log(s"At time $when")
//    log(s"Current time ${AudioManager.audio.currentTime}")
//    log(s"Delta time ${when - AudioManager.audio.currentTime}")

    oscillator.frequency.setValueAtTime(Math.pow(2.0, (note.midi-69)/12.0)*440.0, when)
    gainNode.gain.setTargetAtTime(0.5, when, 0.1)
  }

  def stop(when: Double): Unit = {
    gainNode.gain.setTargetAtTime(0, when, 0.1)
    //oscillator = null
  }
}
