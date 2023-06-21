package iut.projet.model.paint;

import android.graphics.Path;

public class FingerPath {
    //Le FingerPath représente un trait sur l'écran
    public int color; //Couleur du FingerPath
    public int strokeWidth; //Largeur du trait
    public Path path; //Chemin du trait à l'écran

    public FingerPath(int color, int strokeWidth, Path path) {
        this.color = color;
        this.strokeWidth = strokeWidth;
        this.path = path;
    }
}
