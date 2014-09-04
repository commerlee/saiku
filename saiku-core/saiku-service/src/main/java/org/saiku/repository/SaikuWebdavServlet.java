package org.saiku.repository;

import org.apache.jackrabbit.webdav.simple.SimpleWebdavServlet;
import org.saiku.service.datasource.RepositoryDatasourceManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.jcr.Repository;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;

/**
 * Created by bugg on 04/09/14.
 */
public final class SaikuWebdavServlet extends SimpleWebdavServlet {


    private RepositoryDatasourceManager bean;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        ServletContext context = getServletContext();
        WebApplicationContext applicationContext =
                WebApplicationContextUtils
                        .getWebApplicationContext(context);
        bean = (RepositoryDatasourceManager) applicationContext.getBean("repositoryDsManager");
    }

    @Override
    public Repository getRepository() {

        return (Repository) bean.getRepository();
    }


}
