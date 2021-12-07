package org.iota.zebra.verifier;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.webkit.WebView;

import androidx.lifecycle.Observer;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import org.iota.zebra.R;
import org.iota.zebra.datawedge.DataWedgeService;

import java.util.ArrayList;


public class MainActivity extends BridgeActivity {
  private static String TAG = "Verifier - IOTA SDK";

  private DataWedgeService boundService;
  private WebView webView;
  private ServiceConnection serviceConn;
  private boolean isBound = false;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
    }});

    webView = findViewById(R.id.webview);

    // Initializes the code related to DataWedge
    zebraScanInit();
  }

  private void zebraScanInit() {
    // We start our service to capture scanned data
    Intent intent = new Intent(MainActivity.this, DataWedgeService.class);
    startService(intent);

    serviceConn = new ServiceConnection() {
        public void onServiceConnected(ComponentName className, IBinder service) {
          isBound = true;
          // This is called when the connection with the service has
          // been established, giving us the service object we can use
          // to interact with the service.  Because we have bound to a
          // explicit service that we know is running in our own
          // process, we can cast its IBinder to a concrete class and
          // directly access it.
          boundService = ((DataWedgeService.LocalBinder)service).getService();

          final Observer observer = (Observer<String>) str -> {
            Log.i(TAG, "Activity received scan value ...");
            webView.evaluateJavascript("window.onScan(" + "'" + str + "'" + ")", null);
          };
          boundService.getScan().observe(MainActivity.this, observer);
        }

        public void onServiceDisconnected(ComponentName className) {
          // This is called when the connection with the service has
          // been unexpectedly disconnected -- that is, its process
          // crashed. Because it is running in our same process, we
          // should never see this happen.
          Log.e(TAG, "DataWedge Service has been disconnected!!!");
          boundService = null;
      };
    };

    // Establish a connection with the service.  We use an explicit
    // class name because we want a specific service implementation
    // that we know will be running in our own process (and thus
    // won't be supporting component replacement by other
    // applications).
    bindService(new Intent(MainActivity.this, DataWedgeService.class),
            serviceConn, Context.BIND_AUTO_CREATE);
  }

  void doUnbindService() {
    if (isBound) {
      // Detach our existing connection.
      unbindService(serviceConn);
      isBound = false;
      boundService = null;
    }
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    doUnbindService();
  }
}
