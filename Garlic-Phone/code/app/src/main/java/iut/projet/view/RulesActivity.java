package iut.projet.view;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import iut.projet.R;

public class RulesActivity extends AppCompatActivity implements View.OnClickListener {
    Context ctxt=this;
    ImageButton btnBack;
    Button btnPageBack;
    Button btnPageNext;
    ImageView img;
    Integer cpt=1;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.rules_activity);

        btnBack=findViewById(R.id.rules_retour);
        btnPageBack=findViewById(R.id.rules_page_retour);
        btnPageNext=findViewById(R.id.rules_page_next);
        btnBack.setOnClickListener(this);
        btnPageBack.setOnClickListener(this);
        btnPageNext.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.rules_retour) {
            finish();
        }
        img = findViewById(R.id.ruleImg);
        if (v.getId() == R.id.rules_page_retour) {
            if (cpt != 1) {
                if (cpt == 2) {
                    Bitmap bMap = BitmapFactory.decodeResource(getResources(), R.drawable.rule1);
                    img.setImageBitmap(bMap);
                }
                if (cpt == 3) {
                    Bitmap bMap = BitmapFactory.decodeResource(getResources(), R.drawable.rule2);
                    img.setImageBitmap(bMap);
                }
                cpt--;
            }
        }
        if (v.getId() == R.id.rules_page_next) {
            if (cpt != 3) {
                if (cpt == 1) {
                    Bitmap bMap = BitmapFactory.decodeResource(getResources(), R.drawable.rule2);
                    img.setImageBitmap(bMap);
                }
                if (cpt == 2) {
                    Bitmap bMap = BitmapFactory.decodeResource(getResources(), R.drawable.rule3);
                    img.setImageBitmap(bMap);
                }
                cpt++;
            }
        }
    }
}
