package com.vie.pas;

import com.vie.cer.Scutum;
import com.vie.cer.datum.EmpowerScutum;
import com.vie.hors.AbstractException;
import com.vie.une.Instance;
import org.junit.Test;

public class AuthorizerTkt {

    @Test
    public void testPhase1() throws AbstractException {
        final Scutum scutum = Instance.singleton(EmpowerScutum.class);
        scutum.collect("ECA1A0D8-E270-4927-B5A3-74C292E830E4")
                .collect("/api/sys/menu/:appId", "GET")
                .collect();
        System.out.println(scutum.ensure());
    }
}
