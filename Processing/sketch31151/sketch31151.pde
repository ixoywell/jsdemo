/* OpenProcessing Tweak of *@*http://www.openprocessing.org/sketch/31151*@* */
/* !do not delete the line above, required for linking your tweak if you upload again */
void setup()
{
  size (600,600);
  smooth();
  background (5);
  noLoop();
  
  noFill();
  strokeWeight (0.5);
  stroke (255, 12);
}

void draw ()
{
  //background (5,.1);
  
  int dia = 250;
  
  for (int i = 0; i < 10000; i++)
  {
    //background (5,.1);
  strokeWeight (random (0.5, 2));
  float angle1 = random (TWO_PI), angle2 = random (TWO_PI);
    PVector p1 = new PVector (width/2 + cos (angle1) * dia, height/2 + sin (angle1) * dia);
    PVector p2 = new PVector (width/2 + cos (angle2) * dia, height/2 + sin (angle2) * dia);
    
    line (p1.x, p1.y, p2.x, p2.y);
  }
}

void mousePressed ()
{
  //saveFrame ("moon.jpg");
  redraw();
}                               