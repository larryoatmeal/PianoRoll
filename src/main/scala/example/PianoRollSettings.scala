package example

/**
 * Created by Larry on 8/4/15.
 */

trait Setting{
  val name: String
}

case class BooleanVar(var setting: Boolean, override val name: String) extends Setting
case class SelectVar[T](var setting: T, override val name: String, options: Seq[T]) extends Setting
case class IntVar(var setting: Int, override val name: String) extends Setting
case class StringVar(var setting: Int, override val name: String) extends Setting


class PianoRollSettings {
  import PianoRollSettings._
  var state = StateSelect

  var snapEnabled = false
  var snapBeats: Double = PianoRollConfig.BeatsInEighth
  var locatorFollow = true

  val vars: Vector[Setting] = Vector(
    BooleanVar(snapEnabled, "Snap"),
    SelectVar[Double](snapBeats, "Quant", QuantizationOptions),
    BooleanVar(locatorFollow, "Follow"),
    SelectVar[Int](state, "State", AllStates)
  )
}

object PianoRollSettings{
  //states
  val StateSelect = 0//selecting, moving
  //val StateEdit = 1//adding notes, shrinking/expanding notes
  val StatePencil = 2 //adding notes and shrinking exapnding notes
  val AllStates = Vector(StateSelect, StatePencil)


  //quantization options
  val Quarter = PianoRollConfig.BeatsInQuarter
  val Eighth = PianoRollConfig.BeatsInEighth
  val Sixteenth = PianoRollConfig.BeatsInSixteenth
  val QuarterTriplet = PianoRollConfig.BeatResolution / 3.0
  val EightTriplet = PianoRollConfig.BeatsInQuarter / 3.0
  val SixteenthTriplet = PianoRollConfig.BeatsInEighth / 3.0
  val QuantizationOptions: Seq[Double] = Vector(Quarter, Eighth, Sixteenth, QuarterTriplet, EightTriplet, SixteenthTriplet)
}
