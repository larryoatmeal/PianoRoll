package example

/**
 * Created by Larry on 8/15/15.
 */
trait PlayerListener {

  def onEnd(): Unit
  def onBeatChanged(beat: Double): Unit

}
