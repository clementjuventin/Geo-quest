package iut.projet.model.metier;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.database.DataSnapshot;

import java.util.HashMap;
import java.util.Map;

import iut.projet.controller.FirebaseDatabaseHelper;
import iut.projet.controller.RoomDataListener;
import iut.projet.controller.RoomStateListener;

public class Player {
    //Identificateur du joueur
    private String playerId;
        public void setPlayerId(String playerId) {
            this.playerId = playerId;
        }
        public String getPlayerId() {
            return playerId;
        }

    private String playerName;
        public String getPlayerName() {
        return playerName;
    }
    private boolean ready;
        public void setReady(boolean ready) {
            this.ready = ready;
            FirebaseDatabaseHelper.setPlayerReady(this.currentRoom.getRoomCode(), this);
        }

    private Room currentRoom;
        public Room getCurrentRoom() {
            return currentRoom;
        }
        public void setCurrentRoom(Room currentRoom) {
            this.currentRoom = currentRoom;
        }

    public Player(String playerName, String playerId, Boolean ready)
    {
        this(playerName);
        this.ready = ready;
        this.playerId = playerId;
    }
    public Player(String playerName)
    {
        this();
        this.playerName = playerName;
    }
    public Player()
    {
        this.ready = false;
    }

    @Override
    public boolean equals(@Nullable Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof Player)) {
            return false;
        }
        Player c = (Player) o;
        if(c.getPlayerId()==null) return false;
        return c.getPlayerId().equals(getPlayerId());
    }

    public void createRoom(RoomDataListener rdl){
        currentRoom = new Room(this, rdl);
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public void connectToRoom(String roomCode, RoomDataListener rdl){
        Player p = this;
        FirebaseDatabaseHelper.addPlayerToRoom(roomCode, this).addOnCompleteListener(new OnCompleteListener<Void>() {
            @Override
            public void onComplete(@NonNull Task<Void> task) {
                currentRoom = new Room(roomCode, p, rdl);
            }
        });
    }
    public void addRoomStateListener(RoomStateListener rsl, String roomCode){
        FirebaseDatabaseHelper.getRooms().addOnCompleteListener(new OnCompleteListener<DataSnapshot>() {
            @Override
            public void onComplete(@NonNull Task<DataSnapshot> task) {
                if(task.getResult().hasChild(roomCode)){
                    FirebaseDatabaseHelper.isLocked(roomCode, rsl);
                }
                else{
                    rsl.roomNotExist();
                }
            }
        });
    }

    public boolean isReady() {
        return ready;
    }

    public Map<String, String> toDictionary() {
        Map map = new HashMap<String, String>();
        map.put("playerName", getPlayerName());
        map.put("playerId", getPlayerId());
        map.put("ready", ready?"1":"0");
        return map;
    }
    public Task sendExpression(int turnNumber, String expression){
        return FirebaseDatabaseHelper.sendExpression(this.currentRoom.getRoomCode(), getPlayerId(), expression, turnNumber);
    }
}
