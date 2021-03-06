package de.backenddev.led.stripcontrol.ledhandling;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.backenddev.led.stripcontrol.model.ColorProfile;
import de.backenddev.led.stripcontrol.model.LEDStrip;

/**
 * This class is intended to have an overview over the registered strips and
 * control them
 * 
 * @author thum
 *
 */
public class StripRegistry
{
	private static final Logger LOG = LoggerFactory.getLogger( StripRegistry.class );

	/** maps */
	protected final Map<Long, Apa102Meta> map;

	private final boolean stripsEnabled;

	private final int effectTime;

	public StripRegistry( final boolean stripsEnabled, final int effectTime )
	{
		this.map = new HashMap<>( );
		this.stripsEnabled = stripsEnabled;
		this.effectTime = effectTime;
	}

	public void handleSave( final IEvent<LEDStrip> event )
	{
		final Apa102Meta control = getOrCreate( event.getId( ), event.getState( ) );
		final LEDStrip strip = event.getState( );
		updateMeta( control, strip.isEnabled( ), strip.getProfile( ) );
	}

	public void handleSaveProfile( final IEvent<ColorProfile> event )
	{
		if ( event.getId( ) == null )
		{
			/* no action if freshly saved profile */
			return;
		}
		final ColorProfile profile = event.getState( );
		final List<Apa102Meta> matching = getMetaWithProfileId( profile == null ? null : profile.getId( ) );

		matching.stream( ).filter( meta -> meta.isEnabled( ) ).forEach( meta -> updateMeta( meta, null, profile ) );
	}

	private void updateMeta( final Apa102Meta meta, final Boolean isEnabled, final ColorProfile profile )
	{
		try
		{
			meta.update( isEnabled, profile );
		}
		catch ( final IOException e )
		{
			LOG.error( "Couldn't clear state", e );
		}
	}

	public void handleDelete( final IEvent<LEDStrip> event )
	{
		try
		{
			final Apa102Meta apaStrip = this.map.remove( event.getId( ) );
			if ( apaStrip != null )
			{
				apaStrip.shutdown( );
			}
		}
		catch ( final IOException e )
		{
			LOG.error( "Couldn't clear state", e );
		}
	}

	public void handleDeleteProfile( final IEvent<ColorProfile> event )
	{
		final Long profileId = event.getId( );
		final List<Apa102Meta> matching = getMetaWithProfileId( profileId );
		for ( final Apa102Meta meta : matching )
		{
			try
			{
				meta.update( null, null );
			}
			catch ( final IOException e )
			{
				LOG.error( "Couldn't clear state", e );
			}
		}
	}

	private List<Apa102Meta> getMetaWithProfileId( final Long profileId )
	{
		if ( profileId == null )
		{
			return Collections.emptyList( );
		}
		final List<Apa102Meta> matching = this.map.values( ).stream( )
				.filter( meta -> meta.getProfileId( ) != null && meta.getProfileId( ).equals( profileId ) )
				.collect( Collectors.toList( ) );
		return matching;
	}

	private Apa102Meta getOrCreate( final Long stripId, final LEDStrip strip )
	{
		Apa102Meta control = null;
		if ( stripId != null )
		{
			control = this.map.get( stripId );
		}
		if ( control == null )
		{
			try
			{
				control = new Apa102Meta( strip, !this.stripsEnabled, this.effectTime );
				this.map.put( strip.getId( ), control );
			}
			catch ( final IOException e )
			{
				LOG.debug( "Control creation failed", e );
			}
		}
		return control;
	}

}
