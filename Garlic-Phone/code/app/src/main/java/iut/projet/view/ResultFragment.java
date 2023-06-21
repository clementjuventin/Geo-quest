package iut.projet.view;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import iut.projet.R;
import iut.projet.controller.FirebaseDatabaseHelper;
import iut.projet.controller.FirebaseStorageHelper;
import iut.projet.controller.RoomDataListener;
import iut.projet.controller.StorageConnectionListener;
import iut.projet.model.metier.LoadImage;
import iut.projet.model.metier.Player;
import iut.projet.model.metier.Room;

public class ResultFragment extends Fragment {
    private Player player;
    private ImageView imageView;
    private int turn, period;

    public ResultFragment(Player player,int turn,int period){
        super(R.layout.result_display_activity);
        this.player = player;
        this.turn = turn;
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

        TextView usernameTv = ((TextView) getView().findViewById(R.id.pseudo_draw_result_display_activity));
        TextView nextUsernameTv = ((TextView) getView().findViewById(R.id.pseudo_result_display_activity));
        TextView expressionTv = ((TextView) getView().findViewById(R.id.expression_result_display_activity));

        imageView = getView().findViewById(R.id.result_display_activity_image);

        StorageConnectionListener scl = new StorageConnectionListener() {
            @Override
            public void loadUri(Uri uri) {
                LoadImage loadImage = new LoadImage(imageView);
                loadImage.execute(uri.toString());
            }
        };

        RoomDataListener rdl = new RoomDataListener() {
            @Override
            public void initialize() {
                //Le joueur dont on va regarder le dessin en réponse à la derniere expression
                Player p =player.getCurrentRoom().getPlayers().get((turn*2-1+period)%player.getCurrentRoom().getPlayers().size());
                usernameTv.setText(p.getPlayerName());

                FirebaseStorageHelper.getImage(p.getPlayerId() + String.valueOf(turn), scl);
                new CountDownTimer(20*1000, 1000) {
                    public void onTick(long millisUntilFinished) {
                        if(millisUntilFinished<10001){
                            //Le joueur dont on va regarder l'expression en réponse à la dernière image
                            Player p = player.getCurrentRoom().getPlayers().get((turn*2+period)%player.getCurrentRoom().getPlayers().size());
                            nextUsernameTv.setText(p.getPlayerName());
                            FirebaseDatabaseHelper.getExpression(player.getCurrentRoom().getRoomCode(), p.getPlayerId(), turn+1, expressionTv);
                        }
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
                int playersCount = player.getCurrentRoom().getPlayers().size();
                if(period == playersCount-1){
                    Toast.makeText(getContext(), R.string.endOfTheGame, Toast.LENGTH_SHORT).show();

                    Intent intent = new Intent(getActivity(), ActivitePrincipale.class);
                    startActivity(intent);
                }
                else if(turn+1 == playersCount/2+playersCount%2){
                    getFragmentManager().beginTransaction().replace(R.id.fragmentContainer, new ResultStartFragment(player, period+1), null).commit();
                }
                else{
                    getFragmentManager().beginTransaction().replace(R.id.fragmentContainer, new ResultFragment(player, turn+1, period), null).commit();
                }
            }
        };

        new Room(player.getCurrentRoom().getRoomCode(), player, rdl);
    }
}
