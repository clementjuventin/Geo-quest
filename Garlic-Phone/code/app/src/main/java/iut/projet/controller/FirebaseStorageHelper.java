package iut.projet.controller;

import android.graphics.Bitmap;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.io.ByteArrayOutputStream;

import iut.projet.controller.StorageConnectionListener;
import iut.projet.controller.StorageInterractionListener;

public class FirebaseStorageHelper {
    private static FirebaseStorage storage = FirebaseStorage.getInstance();
    private static StorageReference storageRef = storage.getReference();

    public static void sendImage(Bitmap image, String imagePath, StorageInterractionListener sil){//, String message, Player sender){
        StorageReference imageRef = storageRef.child(imagePath);
        // While the file names are the same, the references point to different files
        imageRef.getName().equals(imageRef.getName());    // true

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        byte[] data = baos.toByteArray();

        UploadTask uploadTask = imageRef.putBytes(data);
        uploadTask.addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                sil.failed();
            }
        }).addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
            @Override
            public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                sil.complete();
            }
        });
    }
    public static void getImage(String path, StorageConnectionListener scl){
        StorageReference imageRef = storageRef.child(path);

        imageRef.getDownloadUrl().addOnSuccessListener(new OnSuccessListener<Uri>() {
            @Override
            public void onSuccess(Uri uri) {
                scl.loadUri(uri);
            }
        }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception exception) {
                //Log.d("dev", exception.getMessage());
            }
        });
    }
}
