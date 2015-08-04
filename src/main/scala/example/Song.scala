package example

import scala.util.Random

/**
 * Created by Larry on 7/12/15.
 */


/**
 * @param measures Measures will be zero indexed.
 * @param notes Can be empty
 * @param bpmChanges Must be nonempty
 * @param meterChanges Must be nonempty
 */
case class Song(measures: Int, notes: Vector[Note], bpmChanges: Vector[BPMChange], meterChanges: Vector[MeterChange]){
  val beats = measures * PianoRollConfig.BeatResolution
}

object Song{

  val demoOneNumMeasures = 32 * 8
  val demoOneNotes = Vector.range(0, 500).map(_ => randomNote())
//val demoOneNotes = Vector(new Note(60, 0, 16))

  val demoOneBPMChanges = Vector(new BPMChange(0, 120))
  val demoOneMeterChanges = Vector(new MeterChange(0, PianoRollConfig.BeatResolution))//4/4

  val demoTwoMeterChanges = Vector(MeterChange(0, PianoRollConfig.BeatResolution),MeterChange(2, PianoRollConfig.BeatResolution*3/8),
    MeterChange(4, PianoRollConfig.BeatResolution* 3/4), MeterChange(10, PianoRollConfig.BeatResolution * 2/4),
    MeterChange(25, PianoRollConfig.BeatResolution)
  )//4/4


  val demoSong = Song(demoOneNumMeasures, demoOneNotes, demoOneBPMChanges, demoOneMeterChanges)

  val demoSong2 =demoSong.copy(meterChanges = demoTwoMeterChanges)


  def randomNote(): Note = {
    new Note(Random.nextInt(127), Random.nextInt(16 * 100), Random.nextInt(8))
  }

}
