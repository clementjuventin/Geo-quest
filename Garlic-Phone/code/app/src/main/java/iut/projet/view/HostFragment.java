package iut.projet.view;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import iut.projet.R;
import iut.projet.controller.FirebaseDatabaseHelper;
import iut.projet.model.metier.Player;
import iut.projet.controller.RoomDataListener;

public class HostFragment extends Fragment implements View.OnClickListener {
    private Player player;
    private RoomDataListener rdl;
    private Button btnStart;
    private AdaptateurRoomList adapteur;

    public HostFragment(String playerName, String roomCode){
        super(R.layout.host_activity);
        Bundle bundle = new Bundle();
        bundle.putString("playerName", playerName);
        bundle.putString("roomCode", roomCode);
        setArguments(bundle);
    }
    public HostFragment(String playerName){
        super(R.layout.host_activity);
        Bundle bundle = new Bundle();
        bundle.putString("playerName", playerName);
        setArguments(bundle);
    }

    @Override
    public void onStop() {
        super.onStop();
        player.getCurrentRoom().disableRoomEvents();
    }

    @Override
    public void onStart() {
        super.onStart();
        //Liste des joueurs
        RecyclerView listView = getView().findViewById(R.id.host_activity_listView);
        rdl = new RoomDataListener() {
            @Override
            public void initialize() {
                listView.setLayoutManager(new LinearLayoutManager(getContext()));
                adapteur = new AdaptateurRoomList(player.getCurrentRoom().getPlayers());
                listView.setAdapter(adapteur);
            }

            @Override
            public void update() {
                if(listView.getAdapter() != null)
                    adapteur.updatePlayers(player.getCurrentRoom().getPlayers());
            }

            @RequiresApi(api = Build.VERSION_CODES.N)
            @Override
            public void launch() {
                FirebaseDatabaseHelper.setLocked(player.getCurrentRoom().getRoomCode(), "1");
                player.setReady(false);

                getActivity().getSupportFragmentManager().beginTransaction().replace(R.id.fragmentContainer, new GameStartFragment(player)).commit();
            }
        };
        //Création du joueur
        player = new Player(getArguments().getString("playerName"));

        //Si on rejoin la partie
        if(getArguments().getString("roomCode")!=null){
            ((TextView) getView().findViewById(R.id.host_activity_code)).setText(getArguments().getString("roomCode"));
            player.connectToRoom(getArguments().getString("roomCode"),rdl);
        }
        else {
            player.createRoom(rdl);
            ((TextView) getView().findViewById(R.id.host_activity_code)).setText(player.getCurrentRoom().getRoomCode());
        }
        ((GameActivity) getActivity()).setPlayer(player);
        btnStart=getView().findViewById(R.id.host_activity_start_button);
        btnStart.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.host_activity_start_button) {
            //Il faudrait mettre l'état du joueur à prêt. Si tous les joueurs sont prêts ça commence
            player.setReady(!player.isReady());
        }
    }
}
