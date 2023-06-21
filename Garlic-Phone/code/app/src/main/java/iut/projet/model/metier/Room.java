package iut.projet.model.metier;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import iut.projet.controller.FirebaseDatabaseHelper;
import iut.projet.controller.RoomDataListener;

public class Room {
    //Identifiant de la room dans firebase database
    private final String roomCode;
        public String getRoomCode() {return roomCode;}

    private Player host;
    public List<Player> getPlayers() {
        return players;
    }

    private List<Player> players;
    private DatabaseReference roomRef;
    private ChildEventListener cel;

    //Rejoin une room
    public Room(String roomCode, Player player, RoomDataListener rdl){
        this.roomCode = roomCode;
        players = new ArrayList<>();
        player.setCurrentRoom(this);

        FirebaseDatabaseHelper.getRooms().addOnCompleteListener(new OnCompleteListener<DataSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DataSnapshot> task) {
                if(task.getResult().hasChild(roomCode)){
                    handleRoomEvents(FirebaseDatabaseHelper.joinRoom(roomCode, rdl).child("players"), rdl);
                }
                else{

                }
            }
        });
    }
    //Crée une room à partir d'un host
    public Room(Player host, RoomDataListener rdl){
        this.host = host;
        this.roomCode = generateRoomCode();

        players = new ArrayList<>();

        handleRoomEvents(FirebaseDatabaseHelper.createRoom(this.roomCode, host).child("players"), rdl);
        host.setCurrentRoom(this);

        rdl.initialize();
    }
    //Gere les évennements qui peuvent arriver sur les joueurs de la room
    public void handleRoomEvents(DatabaseReference roomRef, RoomDataListener rdl){
        this.roomRef = roomRef;
        cel = new ChildEventListener() {
            @Override
            public void onChildAdded(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {
                if(snapshot.child("playerName").getValue()!=null&&snapshot.child("playerId").getValue()!=null){
                    Player p = new Player((String) snapshot.child("playerName").getValue(), (String) snapshot.child("playerId").getValue(), ((String) snapshot.child("ready").getValue()).equals("0")?false:true);
                    if(!players.contains(p)){
                        players.add(p);
                    }
                    rdl.update();//On update uniquement si la modification concerne l'ajout ou la suppression d'un joueur
                }
            }

            @Override
            public void onChildChanged(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {
                Player p = new Player((String) snapshot.child("playerName").getValue(), (String) snapshot.child("playerId").getValue(), ((String) snapshot.child("ready").getValue()).equals("0")?false:true);
                if(players.contains(p)){
                    players.set(players.indexOf(p),p);
                }
                rdl.update();
                if(players.size()<3) return;
                for (Player pyr :players){
                    if(!pyr.isReady()) return;
                }
                if(host!=null) FirebaseDatabaseHelper.setLocked(roomCode, "1");
                rdl.launch();
            }

            @Override
            public void onChildRemoved(@NonNull DataSnapshot snapshot) {
                if(snapshot.child("playerName").getValue()!=null&&snapshot.child("playerId").getValue()!=null) {
                    Player p = new Player((String) snapshot.child("playerName").getValue(), (String) snapshot.child("playerId").getValue(), ((String) snapshot.child("ready").getValue()).equals("0") ? false : true);
                    players.remove(p);
                    rdl.update();
                }
            }

            @Override
            public void onChildMoved(@NonNull DataSnapshot snapshot, @Nullable String previousChildName) {

            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        };
        this.roomRef.addChildEventListener(cel);
    }
    //Disable listener
    public void disableRoomEvents(){
        this.roomRef.removeEventListener(cel);
    }

    private String generateRoomCode(){
        int stringLen = 6;
        Random random = new Random();
        char[] generatedString = new char [stringLen];

        for (int i=0;i<stringLen;i++){
            generatedString[i] = (char) ('A' + random.nextInt(26));
        }
        return String.valueOf(generatedString);
    }
    //Retourne l'id du joueur précédent dans l'ordre de jeu (permet de récupérer les informations)
    public String getLastPlayerId(Player currentPlayer){
        /*
        Log.d("getLastPlayerId","Current playerId:"+currentPlayer.getPlayerId());
        Log.d("getLastPlayerId","Position:"+players.indexOf(currentPlayer));
        Log.d("getLastPlayerId","Turn:"+String.valueOf(turn));
        for(Player p : players){
            Log.d("getLastPlayerId","Player "+players.indexOf(p)+": "+ p.getPlayerName());
        }
        Log.d("getLastPlayerId","Next playerId:"+ players.get((players.indexOf(currentPlayer)+turn-1)%players.size()).getPlayerId());
        */
        int size = players.size();
        return players.get((players.indexOf(currentPlayer)-1+size)%size).getPlayerId();
    }
}
