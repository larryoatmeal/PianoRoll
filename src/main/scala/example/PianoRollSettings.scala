package example

/**
 * Created by Larry on 8/4/15.
 */



class PianoRollSettings {
  import PianoRollSettings._
  var state = StateSelect

  var snapEnabled = false
  var snapBeats = PianoRollConfig.BeatsInEighth


}

object PianoRollSettings{
  //states
  val StateSelect = 0//selecting, moving
  val StateEdit = 1//adding notes, shrinking/expanding notes
  val StateAdd = 2
  val AllStates = Vector(StateSelect, StateEdit, StateAdd)




  //quantization options
  val Quarter = PianoRollConfig.BeatsInQuarter
  val Eighth = PianoRollConfig.BeatsInEighth
  val Sixteenth = PianoRollConfig.BeatsInSixteenth
  val QuarterTriplet = PianoRollConfig.BeatResolution / 3.0
  val EightTriplet = PianoRollConfig.BeatsInQuarter / 3.0
  val SixteenthTriplet = PianoRollConfig.BeatsInEighth / 3.0
}
