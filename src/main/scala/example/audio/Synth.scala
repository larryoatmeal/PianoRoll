package example.audio

/**
 * Created by Larry on 8/8/15.
 */

import AudioManager._
import example.{Logger, Note}
import org.scalajs.dom
import org.scalajs.dom.raw.{BiquadFilterNode, GainNode, OscillatorNode}

import scala.collection.immutable.IndexedSeq
import scala.collection.mutable
import scala.collection.mutable.ArrayBuffer

case class BooleanWrapper(var isTrue: Boolean)

class Synth {
  val log = new Logger(this)

  // val gainNode = audio.createGain()

  // val oscillator: OscillatorNode = audio.createOscillator()
  // oscillator.connect(gainNode)
  // oscillator.`type` = "triangle"
  // gainNode.connect(audio.destination)
  // val polyphony = 32

  // val oscillators: IndexedSeq[(OscillatorNode, GainNode, BooleanWrapper)] = (1 to 5).map(
  //   i => {
  //     val gainNode = audio.createGain()
  //     val oscillator: OscillatorNode = audio.createOscillator()
  //     oscillator.connect(gainNode)
  //     oscillator.`type` = "triangle"
  //     gainNode.connect(audio.destination)
  //     oscillator.start()
  //     gainNode.gain.value = 0.0
  //     (oscillator, gainNode, BooleanWrapper(true))
  //   }
  // )

  //polyphonic 
  // def polyphonicPlay(note: Note, start: Double, end: Double) = {
  //   var i = 0
  //   var continue = true

  //   if(start > 0 && end > 0){
  //     while(i < oscillators.length && continue){
  //       val (oscillator, gainNode, free) = oscillators(i)

  //       if(free.isTrue){
  //         log(s"Voice $i")
  //         //start

  //         oscillator.frequency.setValueAtTime(Math.pow(2.0, (note.midi-69)/12.0)*440.0, start)
  //         gainNode.gain.setTargetAtTime(0.5, start, 0.01)
  //         //stop
  //         gainNode.gain.setTargetAtTime(0, end, 0.01)

  //         //break out of loop
  //         free.isTrue = false
  //         dom.setTimeout(()=>{free.isTrue = true}, (end - start) * 1000)
  //         continue = false
  //       }
  //       i = i + 1
  //     }
  //   }
  // }

//  val oscillators = mutable.HashMap[(Int, Int), OscillatorNode]

  def secondsToTimeConstant(sec: Double): Double = sec / 5.0

  val oscList = ArrayBuffer[OscillatorNode]()

  val outputNode = {
    val filter = audio.createBiquadFilter()
    filter.`type` = "lowpass"
    filter.frequency.value = 1500

    filter.connect(audio.destination)
    filter
  }


  def generateOsc(note: Note, start: Double, end: Double, shape: String, gain: Double, asdr: ASDR = standardASDR, detune: Double = 0): Unit ={
    val oscillator: OscillatorNode = audio.createOscillator()
    val pitch = Math.pow(2.0, (note.midi+ detune - 69) / 12.0) * 440.0
    oscillator.frequency.value = pitch

    oscillator.`type` = shape

    val gainNode = audio.createGain()
    gainNode.gain.value = 0

    gainNode.gain.setTargetAtTime(gain, start, secondsToTimeConstant(asdr.a))
    gainNode.gain.setTargetAtTime(asdr.s * gain, start + asdr.a, secondsToTimeConstant(asdr.d))

    gainNode.gain.setTargetAtTime(0, end, secondsToTimeConstant(asdr.r))

    oscillator.connect(gainNode)
    gainNode.connect(outputNode)

    oscillator.start(start)
    oscillator.stop(end + asdr.r)

    oscList.append(oscillator)
  }

  case class ASDR(a: Double, s: Double, d: Double, r: Double)
  val standardASDR = ASDR(a = 0.1, s = 0.8, d = 0.2, r = 0.1)

  def playNote(channel: Int, note: Note, start: Double, end: Double) = {

    val gain = 0.2
    if(channel == 0){
      generateOsc(note, start, end, "triangle", gain, ASDR(0.05, 0.01, 2, 0.1))
      generateOsc(note, start, end, "square", gain, ASDR(0.05, 0.01, 2, 0.1))
      //      generateOsc(note, start, end, "square", 0.5)
    }
    else if(channel == 1){
      generateOsc(note, start, end, "sawtooth", 0.3, ASDR(0.2, 0.9, 1, 0.1))
      generateOsc(note, start, end, "sine", gain, ASDR(0.2, 0.9, 1, 0.1) )
    }else if(channel == 2){
      generateOsc(note, start, end, "sawtooth", gain, ASDR(0.1, 0.9, 1, 0.1))
      generateOsc(note, start, end, "sawtooth", gain, ASDR(0.1, 0.9, 1, 0.1), 0.1)
    }else if(channel == 3){
      generateOsc(note, start, end, "sine", gain, ASDR(0.1, 0.9, 1, 0.1), 0.1)
    }
    else{
      generateOsc(note, start, end, "square", gain, ASDR(0.1, 0.4, 1, 0.1))
    }
  }


//   def polyphonicPlay(note: Note, when: Double): Unit = {
// //    log(s"Playing $note")
// //    log(s"At time $when")
// //    log(s"Current time ${AudioManager.audio.currentTime}")
// //    log(s"Delta time ${when - AudioManager.audio.currentTime}")

//     if(when >= 0){
//       oscillator.frequency.setValueAtTime(Math.pow(2.0, (note.midi-69)/12.0)*440.0, when)
//       gainNode.gain.setTargetAtTime(0.5, when, 0.1)
//     }else{
//       log.error(s"Time $when is negative")
//     }
//   }

  // def stop(when: Double): Unit = {
  //   if(when >= 0){
  //     gainNode.gain.setTargetAtTime(0, when, 0.1)
  //   } else{
  //     log.error(s"Time $when is negative")
  //   }
  //   //oscillator = null
  // }
  
  def stopAll(): Unit = {
//    oscillators.foreach(osc => osc._2.gain.value = 0)
    oscList.foreach{
      osc =>
      try{
        osc.stop(0)
      }catch{
        case e: Exception => {
          0
        }
      }
    }
    oscList.clear()
  }
}
