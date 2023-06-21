package iut.projet.view;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import iut.projet.R;

public class RoomListViewHolder extends RecyclerView.ViewHolder {
    private TextView name;

    public TextView getName() {
        return name;
    }

    public void setName(TextView name) {
        this.name = name;
    }

    public ImageView readyDot;

    public void changeReadyDot(Boolean b){
        if(b){
            readyDot.setImageResource(R.drawable.green_dot);
        }
        else {
            readyDot.setImageResource(R.drawable.red_dot);
        }
    }

    public RoomListViewHolder(@NonNull View itemView) {
        super(itemView);
        name = itemView.findViewById(R.id.player_list_cell_name);
        readyDot = itemView.findViewById(R.id.player_list_cell_state);
    }
}
