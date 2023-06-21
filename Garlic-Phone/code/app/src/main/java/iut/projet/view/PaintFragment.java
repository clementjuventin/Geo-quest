package iut.projet.view;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Shader;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.android.material.textfield.TextInputLayout;
import com.rtugeek.android.colorseekbar.ColorSeekBar;

import iut.projet.R;
import iut.projet.controller.FirebaseDatabaseHelper;
import iut.projet.controller.FirebaseStorageHelper;
import iut.projet.controller.RoomStateListener;
import iut.projet.model.metier.Player;
import iut.projet.model.metier.Room;
import iut.projet.controller.RoomDataListener;
import iut.projet.controller.StorageInterractionListener;
import iut.projet.model.paint.PaintView;

public class PaintFragment extends Fragment implements View.OnClickListener{

    private PaintView paintView;

    private Boolean validated = false;

    private Player player;
    private  int turn;
    private TextView chrono;
    private TextView expressionTextView;

    public PaintFragment(Player player, int turn){
        super(R.layout.paint_activity);
        this.player = player;
        this.turn = turn;
    }

    @Override
    public void onStart() {
        super.onStart();

        ColorSeekBar colorSeekBar = getView().findViewById(R.id.colorSlider);
        colorSeekBar.setOnColorChangeListener(new ColorSeekBar.OnColorChangeListener() {
            @Override
            public void onColorChangeListener(int colorBarPosition, int alphaBarPosition, int color) {
                paintView.setCurrentColor(color);
            }
        });

        getView().findViewById(R.id.paint_activity_backButton).setOnClickListener(this);
        getView().findViewById(R.id.paint_activity_readyButton).setOnClickListener(this);

        //Paint view settings
        paintView = (PaintView) getView().findViewById(R.id.paintView);
        DisplayMetrics metrics = new DisplayMetrics();
        getActivity().getWindowManager().getDefaultDisplay().getMetrics(metrics);
        paintView.init(metrics);

        chrono = ((TextView) getView().findViewById(R.id.paint_activity_chrono));
        expressionTextView = ((TextView) getView().findViewById(R.id.paint_activity_expression));

        RoomDataListener rdl = new RoomDataListener() {
            @Override
            public void initialize() {
                FirebaseDatabaseHelper.getExpression(player.getCurrentRoom().getRoomCode(), player.getCurrentRoom().getLastPlayerId(player), turn, expressionTextView);
                new CountDownTimer(60 * 1000, 1000) {
                    public void onTick(long millisUntilFinished) {
                        chrono.setText(String.valueOf(millisUntilFinished / 1000));
                        if(millisUntilFinished<1001){
                            paintView.setDrawIsEnable(false);
                        }
                    }

                    public void onFinish() {
                        if(!validated){
                            validated = true;
                            sendImage();
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
                getFragmentManager().beginTransaction().replace(R.id.fragmentContainer, new DescribeImageFragment(player, turn+1), null).commit();
            }
        };
        new Room(player.getCurrentRoom().getRoomCode(), player, rdl);
    }
    @Override
    public void onStop() {
        super.onStop();
        player.getCurrentRoom().disableRoomEvents();
    }
    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.paint_activity_backButton:
                paintView.deleteLastFingerPath();
                break;
            case R.id.paint_activity_readyButton:
                if(!validated){
                    validated = true;
                    sendImage();
                }
                break;
        }
    }
    private void sendImage(){
        Bitmap image = paintView.getmBitmap();
        StorageInterractionListener sil = new StorageInterractionListener() {
            @Override
            public void complete() {
                player.setReady(true);
            }

            @Override
            public void failed() {

            }
        };
        if(player!=null && player.getCurrentRoom()!=null){
            FirebaseStorageHelper.sendImage(image, player.getPlayerId() + String.valueOf(turn), sil);
            Toast.makeText(getContext(), R.string.image_sent, Toast.LENGTH_SHORT).show();
        }
    }
}