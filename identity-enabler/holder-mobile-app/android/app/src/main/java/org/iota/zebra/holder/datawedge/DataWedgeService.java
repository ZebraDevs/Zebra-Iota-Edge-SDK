package org.iota.zebra.holder.datawedge;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.util.Log;

public class DataWedgeService extends Service {

    private static final String TAG = "Holder - IOTA DataWedge";
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
        Log.i(TAG, "onCreate Data Wedge: ");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent.hasExtra("com.symbol.datawedge.source")) {
            Log.i(TAG, "DataWedge content available");
            data.setValue(intent.getStringExtra("com.symbol.datawedge.data_string"));
        }
        return START_NOT_STICKY;
    }

    public LiveData<String> getScan() {
        return data;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }
}
