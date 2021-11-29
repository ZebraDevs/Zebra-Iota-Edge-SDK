package org.iota.zebra;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.view.View;
import android.webkit.WebView;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.Observer;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.ahm.capacitor.camera.preview.CameraPreview;
import com.dutchconcepts.capacitor.barcodescanner.BarcodeScanner;

import org.iota.zebra.datawedge.DataWedgeService;

import java.util.ArrayList;


public class MainActivity extends BridgeActivity {
  private DataWedgeService boundService;
  private WebView webView;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Log.i("IOTA", "onCreate: ");

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(CameraPreview.class);
      add(BarcodeScanner.class);
    }});

    webView = findViewById(R.id.webview);

    zebraScanInit();
  }

  private void zebraScanInit() {
    // We start our service to capture scanned data
    Intent intent = new Intent(MainActivity.this, DataWedgeService.class);
    startService(intent);

    ServiceConnection sc = new ServiceConnection() {
        public void onServiceConnected(ComponentName className, IBinder service) {
          // This is called when the connection with the service has
          // been established, giving us the service object we can use
          // to interact with the service.  Because we have bound to a
          // explicit service that we know is running in our own
          // process, we can cast its IBinder to a concrete class and
          // directly access it.
          boundService = ((DataWedgeService.LocalBinder)service).getService();

          final Observer observer = new Observer<String>() {
            public void onChanged(String str) {
              Log.i("IOTA", "Activity received the value: " + str);
              webView.loadUrl("javascript:alert('hello');");
            }
          };
          boundService.getScan().observe(MainActivity.this, observer);
        }

        public void onServiceDisconnected(ComponentName className) {
          // This is called when the connection with the service has
          // been unexpectedly disconnected -- that is, its process
          // crashed. Because it is running in our same process, we
          // should never see this happen.
          boundService = null;
      };
    };

    // Establish a connection with the service.  We use an explicit
    // class name because we want a specific service implementation
    // that we know will be running in our own process (and thus
    // won't be supporting component replacement by other
    // applications).
    bindService(new Intent(MainActivity.this, DataWedgeService.class),
            sc, Context.BIND_AUTO_CREATE);
  }

  public void execute() {
    Log.i("IOTA", "execute!!!!");
    View view = findViewById(R.id.webview);
  }
}
