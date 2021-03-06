package de.backenddev.led.stripcontrol.springbackend.converter;

import org.springframework.boot.context.properties.ConfigurationPropertiesBinding;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;

import de.backenddev.led.stripcontrol.model.LEDStrip;

@Component
@ConfigurationPropertiesBinding
public class LEDStripConverter implements Converter<String, LEDStrip>
{

	@Override
	public LEDStrip convert( final String source )
	{
		if ( source == null )
		{
			return null;
		}
		final Gson gson = new Gson( );
		return gson.fromJson( source, LEDStrip.class );
	}

}
