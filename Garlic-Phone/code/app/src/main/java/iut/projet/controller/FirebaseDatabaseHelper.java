package iut.projet.controller;

import android.util.Log;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import iut.projet.model.metier.Player;

public class FirebaseDatabaseHelper {
    private static FirebaseDatabase database = FirebaseDatabase.getInstance("https://applicationdessineitandroid-default-rtdb.europe-west1.firebasedatabase.app/");

    //Permet de créer une room à partir d'un code et d'un host
    public static DatabaseReference createRoom(String roomCode, Player host){
        DatabaseReference roomRef = database.getReference(roomCode);//->debug"ABC");//
        String key = roomRef.push().getKey();
        host.setPlayerId(key);

        roomRef.child("players").child(host.getPlayerId()).setValue(host.toDictionary());
        roomRef.child("game").child("locked").setValue("0");
        return roomRef;
    }
    //Permet de rejoindre une room, à partir d'un roomCode: ATTENTION: On suppose que la room existe déjà (cf getRooms) et si elle est bloquée (cf isLocked)
    public static DatabaseReference joinRoom(String roomCode, RoomDataListener rdl) {
        DatabaseReference roomRef = database.getReference(roomCode);
        roomRef.get().addOnCompleteListener(new OnCompleteListener<DataSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DataSnapshot> task) {
                rdl.initialize();
            }
        });
        return roomRef;
    }
    //Ajoute un joueur dans une room
    public static Task<Void> addPlayerToRoom(String roomCode, Player player) {
        DatabaseReference roomRef = database.getReference(roomCode);

        player.setPlayerId(roomRef.push().getKey());
        return roomRef.child("players").child(player.getPlayerId()).setValue(player.toDictionary());
    }
    //Retourne les rooms qui existent
    public static Task<DataSnapshot> getRooms() {
        return database.getReference().get();
    }
    //Teste si la room est bloquée (si elle est bloquée on ne peut pas rejoindre)
    public static void isLocked(String roomCode, RoomStateListener rsl){
        DatabaseReference roomRef = database.getReference(roomCode);
        roomRef.child("game").child("locked");
        roomRef.get().addOnCompleteListener(new OnCompleteListener<DataSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DataSnapshot> task) {
                if(task.getResult().hasChild("game")){
                    if(((String) task.getResult().child("game").child("locked").getValue()).equals("0")){
                        rsl.roomExist();
                        return;
                    }
                }
                rsl.roomNotExist();
            }
        });
    }
    //Met à jour l'état du joueur (si il est prêt à joueur)
    public static void setPlayerReady(String roomCode, Player player) {
        DatabaseReference roomRef = database.getReference(roomCode);
        roomRef.child("players").child(player.getPlayerId()).child("ready").setValue(player.isReady()?"1":"0");
    }
    //Set le champ "locked" de la room
    public static void setLocked(String roomCode, String state) {
        DatabaseReference roomRef = database.getReference(roomCode);
        roomRef.child("game").child("locked").setValue(state);
    }
    //Envois une expression dans la database
    public static Task sendExpression(String roomCode, String playerId, String expression, int turn){
        DatabaseReference roomRef = database.getReference(roomCode);
        return roomRef.child("game").child("turn"+String.valueOf(turn)).child(playerId).setValue(expression);
    }
    //Récupère une expression dans la database
    public static void getExpression(String roomCode, String targetId, int turn, TextView textView){
        DatabaseReference roomRef = database.getReference(roomCode);
        roomRef.child("game").child("turn"+String.valueOf(turn)).child(targetId).get().addOnCompleteListener(new OnCompleteListener<DataSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DataSnapshot> task) {
                textView.setText((String) task.getResult().getValue());
            }
        });
    }
    //Supprime le joueur
    public static void removePlayer(Player player, String roomCode){
        DatabaseReference roomRef = database.getReference(roomCode);
        roomRef.child("players").child(player.getPlayerId()).removeValue();
        roomRef.get().addOnCompleteListener(new OnCompleteListener<DataSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DataSnapshot> task) {
                if(!task.getResult().hasChild("players")){
                    roomRef.removeValue();
                }
            }
        });
    }
}
