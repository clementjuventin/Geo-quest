package iut.projet.view;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputLayout;

import iut.projet.R;
import iut.projet.model.metier.Player;
import iut.projet.controller.RoomStateListener;

public class JoinActivity extends AppCompatActivity implements View.OnClickListener {

    Button btnEnter;
    TextInputLayout inputText;
    public static String inputRoomCode;

    public static String getInputRoomCode() {
        return inputRoomCode;
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.join_activity);

        inputText = (TextInputLayout) findViewById(R.id.joinActivity_code);

        btnEnter = findViewById(R.id.joinActivity_entrer_button);
        btnEnter.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.joinActivity_entrer_button) {
            Player p = new Player(getIntent().getStringExtra("playerName"));
            String roomCode;
            roomCode = ((TextInputLayout)findViewById(R.id.joinActivity_code)).getEditText().getText().toString().toUpperCase();

            AppCompatActivity thisActivity = this;
            RoomStateListener roomStateListener = new RoomStateListener() {
                @Override
                public void roomNotExist() {
                    Toast.makeText(getApplicationContext(), R.string.conn_error_text, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void roomExist() {
                    Intent intent = new Intent(thisActivity, GameActivity.class);
                    intent.putExtra("roomCode",roomCode);
                    intent.putExtra("playerName",p.getPlayerName());
                    startActivity(intent);
                }
            };
            p.addRoomStateListener(roomStateListener, roomCode);
        }
    }
}
