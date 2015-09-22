package example

import example.PianoRollSettings._
import org.scalajs.dom.raw.CanvasRenderingContext2D

/**
 * Created by Larry on 9/11/15.
 */

class MenuRenderer(ctx: CanvasRenderingContext2D, rect: Rectangle, messageQueue: MessageQueue) {

  val playButton = new SmartImage("images/play.png"){
    override def onClick(x: Double, y: Double): Unit = messageQueue.send(MessageQueue.PLAY)
  }
  val stopButton = new SmartImage("images/stop.png"){
    override def onClick(x: Double, y: Double): Unit = messageQueue.send(MessageQueue.STOP)
  }
  val pauseButton = new SmartImage("images/pause.png"){
    override def onClick(x: Double, y: Double): Unit = messageQueue.send(MessageQueue.STOP)
  }
  val endButton = new SmartImage("images/play.png"){
    override def onClick(x: Double, y: Double): Unit = messageQueue.send(MessageQueue.PLAY)
  }
  val beginButton = new SmartImage("images/play.png"){
    override def onClick(x: Double, y: Double): Unit = messageQueue.send(MessageQueue.PLAY)
  }

  val playPauseButton = new ToggleImage(playButton, pauseButton)

  val playbackPanel = Vector(playPauseButton)

  val pencilButtonInactive = new SmartImage("images/pencil.png")
  val pencilButtonActive = new SmartImage("images/pencilGreen.png")
  val pencilButton = new ActiveInactiveImage(pencilButtonActive,pencilButtonInactive,
    (x, y) => {resetToolPanel();messageQueue.send(MessageQueue.TOOL_PENCIL)})


  val selectButtonInactive = new SmartImage("images/select.png")
  val selectButtonActive = new SmartImage("images/selectGreen.png")
  val selectButton = new ActiveInactiveImage(selectButtonActive,selectButtonInactive,
    (x, y) => {resetToolPanel();messageQueue.send(MessageQueue.TOOL_SELECT)})
  val toolPanel = Vector(selectButton, pencilButton)

  val helpButton = new SmartImage("images/question.png"){
    override def onClick(x: Double, y: Double): Unit = messageQueue.send(MessageQueue.HELP)
  }

  /**
   * Called when user selects tool via short cut
   * @param toolMessage
   */
  def selectToolExternal(toolMessage: Int): Unit ={
    resetToolPanel()
    toolMessage match{
      case MessageQueue.TOOL_PENCIL =>  pencilButton.activate()
      case MessageQueue.TOOL_SELECT =>  selectButton.activate()
    }
  }
  def resetToolPanel(): Unit = toolPanel.foreach{_.deActivate()}


//  val playbackContainer = new LinearContainer()
//  playbackContainer.bulkAdd(playbackPanel, 0.1, 0.8, 0)
//
//  val toolsContainer = new LinearContainer()
//  toolsContainer.bulkAdd(toolPanel, 0.1, 0.8, 0.05)
//
//  val subContainers = Vector(playbackContainer, toolsContainer)
//
//  val masterContainer: LinearContainer = new LinearContainer()
//  masterContainer.addChild(ChildObject(0.0, 0.1, 0.3, 0.8, playbackContainer))
//  masterContainer.addChild(ChildObject(0.7, 0.1, 0.3, 0.8, toolsContainer))


  val masterContainer: LinearContainer = new LinearContainer()

  masterContainer.bulkAdd(playbackPanel, 0.05, 0.8, 0.01)
  masterContainer.bulkAdd(toolPanel ++ Vector(helpButton), 0.05, 0.8, 0.01, 0.8)


  def draw(): Unit ={

    ctx.fillStyle = "#FAFAD2"
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    masterContainer.render(rect.x, rect.y, rect.width, rect.height, ctx)

  }

  def onClick(x: Double, y: Double): Unit = {
    masterContainer.onClick(x, y)
  }

}
