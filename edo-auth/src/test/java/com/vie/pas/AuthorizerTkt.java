package com.vie.pas;

import com.vie.cer.Scutum;
import com.vie.cer.datum.DataScutum;
import com.vie.hors.AbstractException;
import com.vie.une.Instance;
import org.junit.Test;

public class AuthorizerTkt {

    @Test
    public void testPhase1() throws AbstractException {
        final Scutum scutum = Instance.singleton(DataScutum.class);
        final String[] codes = scutum.collect("89A0DABB-9E4B-4015-912E-8B341E7C7B47");
        for (final String code : codes) {
            System.out.println(code);
        }
    }
}
