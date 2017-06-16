PImage img;
int grid = 4 ; //

void setup(){
  size(499,600); //
  img = loadImage("er.jpg");  //
  noLoop();
  colorMode(HSB,255);
   background(0,0,255);
}

void draw(){
  color c;
  fill(0);
  noStroke();
  ellipseMode(CENTER);
  for ( int y =0;y<height; y+= grid)
    for(int x = 0;x<width;x++){
      c = img.get(int(map(x,0,width,0,img.width)),int(map(y,0,height,0,img.height)));
      ellipse(x,y+grid/2,grid*(1-brightness(c)/255),grid*(1-brightness(c)/255));
    }   
  save("hesui.jpg");
}