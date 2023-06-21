package iut.projet.view;

import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import iut.projet.R;
import iut.projet.controller.FirebaseDatabaseHelper;
import iut.projet.controller.RoomDataListener;
import iut.projet.model.metier.Player;
import iut.projet.model.metier.Room;

public class ResultStartFragment extends Fragment {
    private Player player;
    //Period count: (ie: Quand on suis la trame de jeu à partir du ième joueur, period=2 <=> On part du mot donné par le 3eme joueur)
    private int turn, period;

    public ResultStartFragment(Player player,int period){
        super(R.layout.result_start_activity);
        this.player = player;
        this.turn = 1;
        this.period = period;
    }
    @Override
    public void onStop() {
        super.onStop();
        player.getCurrentRoom().disableRoomEvents();
    }
    @Override
    public void onStart() {
        super.onStart();

        TextView expressionTv = ((TextView) getView().findViewById(R.id.expression_result_start_activity));
        TextView usernameTv = ((TextView) getView().findViewById(R.id.pseudo_result_start_activity));

        RoomDataListener rdl = new RoomDataListener() {
            @Override
            public void initialize() {
                FirebaseDatabaseHelper.getExpression(player.getCurrentRoom().getRoomCode(), player.getCurrentRoom().getPlayers().get(turn-1+period).getPlayerId(), turn, expressionTv);
                usernameTv.setText(player.getCurrentRoom().getPlayers().get(turn-1+period).getPlayerName());

                new CountDownTimer(8*1000, 1000) {
                    public void onTick(long millisUntilFinished) {
                        if(millisUntilFinished<4001 && millisUntilFinished>999){
                            Toast.makeText(getContext(), String.valueOf((int)millisUntilFinished/1000), Toast.LENGTH_SHORT).show();
                        }
                    }
                    public void onFinish() {
                        player.setReady(true);
                    }
                }.start();
            }

            @Override
            public void update() {

            }

            @Override
            public void launch() {
                player.setReady(false);
                player.getCurrentRoom().disableRoomEvents();
                getFragmentManager().beginTransaction().replace(R.id.fragmentContainer, new ResultFragment(player, turn, period), null).commit();
            }
        };

        new Room(player.getCurrentRoom().getRoomCode(),player,rdl);
    }
}
