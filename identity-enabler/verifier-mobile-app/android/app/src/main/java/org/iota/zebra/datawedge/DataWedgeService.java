package org.iota.zebra.datawedge;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.LifecycleOwner;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;

import android.app.Activity;
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import android.widget.Toast;

import org.iota.zebra.MainActivity;

public class DataWedgeService extends Service {

    private static final String TAG = "Zebra-IOTA-DataWedge";
    private  MutableLiveData<String> data;

    public class LocalBinder extends Binder {
        public DataWedgeService getService() {
            return DataWedgeService.this;
        }
    }
    private IBinder binder = new LocalBinder();

    @Override
    public void onCreate() {
        super.onCreate();
        data = new MutableLiveData<String>();
        Log.i("IOTA", "onCreate Data Wedge: ");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Toast.makeText(this, "service starting", Toast.LENGTH_SHORT).show();
        if (intent.hasExtra("com.symbol.datawedge.source")) {
            Log.i("IOTA", intent.getStringExtra("com.symbol.datawedge.source"));
            Log.i("IOTA", intent.getStringExtra("com.symbol.datawedge.data_string"));

            data.setValue(intent.getStringExtra("com.symbol.datawedge.data_string"));
        }
        return START_NOT_STICKY;
    }

    public LiveData<String> getScan() {
        return data;
    }

    @Override
    public IBinder onBind(Intent intent) {
        // We don't provide binding, so return null
        return binder;
    }
}
