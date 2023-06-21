package iut.projet.view;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import iut.projet.R;
import iut.projet.controller.FirebaseDatabaseHelper;
import iut.projet.model.metier.Player;

public class GameActivity extends AppCompatActivity {
    private Player player;
    public void setPlayer(Player player) {
        this.player = player;
    }
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.game_activity);
        Fragment fragment = getSupportFragmentManager().findFragmentById(R.id.fragmentContainer);
        Fragment hostFragment;

        if(getIntent().getStringExtra("roomCode")!=null){
            hostFragment = new HostFragment(getIntent().getStringExtra("playerName"),getIntent().getStringExtra("roomCode"));
        }
        else {
            hostFragment = new HostFragment(getIntent().getStringExtra("playerName"));
        }
        if(fragment == null){
            getSupportFragmentManager().beginTransaction().replace(R.id.fragmentContainer, hostFragment, null).commit();
        }
    }
    @Override
    protected void onStop() {
        super.onStop();
        FirebaseDatabaseHelper.removePlayer(player, player.getCurrentRoom().getRoomCode());
    }
}
