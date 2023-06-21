package iut.projet.model.paint;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.util.AttributeSet;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;

import java.util.ArrayList;

public class PaintView extends View {
    //La PaintView est un composant android dans lequel on va pouvoir dessiner, l'url du tuto ->
    //https://ssaurel.medium.com/learn-to-create-a-paint-application-for-android-5b16968063f8

    public static int BRUSH_SIZE = 10; //Largeur du pinceau
    public static  final int DEFAULT_COLOR = Color.BLUE; //Couleur par défaut du pinceau
    public static final int DEFAULT_BG_COLOR = Color.WHITE; //Couleur du fond
    private static final float TOUCH_TOLERANCE = 4; //

    private float mX, mY; //Position x et y du doigt à l'écran
    private Path mPath; //Chemin du doigt
    private Paint mPaint;
    private ArrayList<FingerPath> paths = new ArrayList<>(); //Tous les traits qui composent l'image
    private int currentColor; //Couleur actuelle du pinceau
    private int backgroundColor = DEFAULT_BG_COLOR;
    private int strokeWidth; //Largeur du trait
    private Bitmap mBitmap; //Image en bitmap
    public Bitmap getmBitmap() {
        return mBitmap;
    }

    //Permet d'autoriser ou non le dessin
    private Boolean drawIsEnable;
    public void setDrawIsEnable(Boolean b){drawIsEnable=b;}

    private Canvas mCanvas;
    private Paint mBitmapPaint = new Paint(Paint.DITHER_FLAG);

    public PaintView(Context context) {
        super(context);
    }

    public PaintView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mPaint = new Paint();
        mPaint.setAntiAlias(true); //Anti aliasing activé
        mPaint.setColor(DEFAULT_COLOR); //Couleur du pinceau par défaut
        mPaint.setStyle(Paint.Style.STROKE); //Type de "mine", ici c'est un trait plein
        mPaint.setStrokeJoin(Paint.Join.ROUND); //Forme de la mine ronde
        mPaint.setStrokeCap(Paint.Cap.ROUND);
        mPaint.setXfermode(null);
        mPaint.setAlpha(0xff);
        drawIsEnable = true;
    }

    public void init(DisplayMetrics metrics) {
        int height = metrics.heightPixels;
        int width = metrics.widthPixels;

        mBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        mCanvas = new Canvas(mBitmap);

        currentColor = DEFAULT_COLOR;
        strokeWidth = BRUSH_SIZE;
    }

    public void clear() {
        backgroundColor = DEFAULT_BG_COLOR;
        paths.clear();
        invalidate();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        canvas.save();
        mCanvas.drawColor(backgroundColor);

        for (FingerPath fp : paths) {
            mPaint.setColor(fp.color);
            mPaint.setStrokeWidth(fp.strokeWidth);
            mPaint.setMaskFilter(null);

            mCanvas.drawPath(fp.path, mPaint);

        }

        canvas.drawBitmap(mBitmap, 0, 0, mBitmapPaint);
        canvas.restore();
    }

    private void touchStart(float x, float y) {
        mPath = new Path();
        FingerPath fp = new FingerPath(currentColor, strokeWidth, mPath);
        paths.add(fp);

        mPath.reset();
        mPath.moveTo(x, y);
        mX = x;
        mY = y;
    }

    private void touchMove(float x, float y) {
        float dx = Math.abs(x - mX);
        float dy = Math.abs(y - mY);

        if (dx >= TOUCH_TOLERANCE || dy >= TOUCH_TOLERANCE) {
            mPath.quadTo(mX, mY, (x + mX) / 2, (y + mY) / 2);
            mX = x;
            mY = y;
        }
    }

    private void touchUp() {
        mPath.lineTo(mX, mY);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        if(!drawIsEnable) return false;
        float x = event.getX();
        float y = event.getY();

        switch(event.getAction()) {
            case MotionEvent.ACTION_DOWN :
                touchStart(x, y);
                invalidate();
                break;
            case MotionEvent.ACTION_MOVE :
                touchMove(x, y);
                invalidate();
                break;
            case MotionEvent.ACTION_UP :
                touchUp();
                invalidate();
                break;
        }
        return true;
    }
    public void setCurrentColor(int color){
        currentColor = color;
    }
    public void deleteLastFingerPath(){
        if(paths.isEmpty()) return;
        paths.remove(paths.size()-1);
        invalidate();
    }
}
