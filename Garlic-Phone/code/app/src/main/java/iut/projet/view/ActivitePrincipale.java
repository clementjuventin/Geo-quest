package iut.projet.view;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.textfield.TextInputLayout;

import iut.projet.R;

public class ActivitePrincipale extends AppCompatActivity implements View.OnClickListener{

    Context ctxt = this;
    Button btnHost;
    Button btnJoin;
    Button btnRules;
    TextInputLayout inputText;
    public static String name;
        public static String getName() {return name;}

    private SharedPreferences preferences;


    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activite_principale);
        preferences = this.getSharedPreferences(
                "fr.iut.cours", Context.MODE_PRIVATE);

        inputText=(TextInputLayout) findViewById(R.id.activite_principale_player_name);
        inputText.getEditText().setText(preferences.getString("fr.iut.cours.name", "Incognito"));

        btnHost=findViewById(R.id.host);
        btnJoin=findViewById(R.id.join);
        btnRules=findViewById(R.id.rules);
        btnHost.setOnClickListener(this);
        btnJoin.setOnClickListener(this);
        btnRules.setOnClickListener(this);

    }
    @Override
    public void onClick(View v) {
        name = inputText.getEditText().getText().toString();
        updatePreferencesForName(name);
        if (v.getId() == R.id.host) {
            Intent intent = new Intent(this, GameActivity.class);
            intent.putExtra("playerName",name);

            startActivity(intent);
        }
        if (v.getId() == R.id.join) {
            Intent intent = new Intent(this, JoinActivity.class);
            intent.putExtra("playerName",name);

            startActivity(intent);
        }
        if (v.getId() == R.id.rules) {
            Intent intent = new Intent(ctxt, RulesActivity.class);
            startActivity(intent);
        }
    }
    private void updatePreferencesForName(String name){
        preferences.edit().putString("fr.iut.cours.name", name.isEmpty()?"Incognito":name).apply();
    }
}

