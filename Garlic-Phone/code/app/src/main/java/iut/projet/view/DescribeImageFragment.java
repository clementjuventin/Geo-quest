package iut.projet.view;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.material.textfield.TextInputLayout;

import iut.projet.R;
import iut.projet.controller.FirebaseStorageHelper;
import iut.projet.model.metier.LoadImage;
import iut.projet.model.metier.Player;
import iut.projet.model.metier.Room;
import iut.projet.controller.RoomDataListener;
import iut.projet.controller.StorageConnectionListener;

public class DescribeImageFragment extends Fragment implements View.OnClickListener {
    private ImageView imageView;
    private Player player;
    private TextView chrono;
    private int turn;
    private Boolean validated = false;

    public DescribeImageFragment(Player player, int turn) {
        super(R.layout.describe_image_activity);
        this.player = player;
        this.turn = turn;
    }

    @Override
    public void onStop() {
        super.onStop();
        player.getCurrentRoom().disableRoomEvents();
    }
    @Override
    public void onStart() {
        super.onStart();
        imageView = getView().findViewById(R.id.describe_image_activity_image);

        getView().findViewById(R.id.describe_image_activity_readyButton).setOnClickListener(this);

        chrono = ((TextView) getView().findViewById(R.id.describe_image_activity_chrono));

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
                //Permet de récupérer les images
                //Log.d("DEV", "SupposedName: "+player.getCurrentRoom().getLastPlayerId(player,turn)+String.valueOf(turn));
                FirebaseStorageHelper.getImage(player.getCurrentRoom().getLastPlayerId(player)+String.valueOf(turn-1), scl);
                new CountDownTimer(30*1000, 1000) {
                    public void onTick(long millisUntilFinished) {
                        chrono.setText(String.valueOf(millisUntilFinished / 1000));
                    }
                    public void onFinish() {
                        if(!validated){
                            validated = true;
                            submit();
                        }
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
                int playerSize = player.getCurrentRoom().getPlayers().size();
                if(playerSize/2+playerSize%2==turn){
                    getFragmentManager().beginTransaction().replace(R.id.fragmentContainer, new ResultStartFragment(player, 0), null).commit();
                }
                else {
                    getFragmentManager().beginTransaction().replace(R.id.fragmentContainer, new PaintFragment(player, turn), null).commit();
                }
            }
        };
        new Room(player.getCurrentRoom().getRoomCode(),player,rdl);
    }

    private void submit(){
        player.sendExpression(turn, ((TextInputLayout) getView().findViewById(R.id.describe_image_activity_player_suggestion)).getEditText().getText().toString()).addOnCompleteListener(new OnCompleteListener() {
            @Override
            public void onComplete(@NonNull Task task) {
                player.setReady(true);
            }
        });
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.describe_image_activity_readyButton:
                if(!validated){
                    validated = true;
                    submit();
                }
                break;
        }
    }
}
